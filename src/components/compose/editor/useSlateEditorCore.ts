
import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { createEditor, Descendant, Node, Editor, Transforms, Element as SlateElement, Text } from 'slate';
import { withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { CustomEditor, DEFAULT_INITIAL_VALUE } from './types';
import { getPageHeight } from './PageBreakHandler';

interface UseSlateEditorCoreProps {
  content: string;
  setContent: (content: string) => void;
  handleAutoSave: () => void;
  dimensions: any;
}

export function useSlateEditorCore({
  content,
  setContent,
  handleAutoSave,
  dimensions
}: UseSlateEditorCoreProps) {
  // Parse content for Slate
  const [slateValue, setSlateValue] = useState<Descendant[]>(() => {
    try {
      // Try to parse existing content as Slate value
      if (content && content.trim()) {
        // If content has HTML formatting, convert it to Slate format
        if (content.includes('<')) {
          return DEFAULT_INITIAL_VALUE;
        }
        // If it's already in Slate format (JSON), parse it
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('Error parsing content:', error);
    }
    // Default to empty editor
    return DEFAULT_INITIAL_VALUE;
  });

  // For page break calculation
  const canvasRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [pageHeight, setPageHeight] = useState(0);

  // Stats
  const [wordCount, setWordCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  
  // Typing tracking
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Prevent pagination recursion
  const isPaginatingRef = useRef(false);
  const isInsideChangeHandlerRef = useRef(false);

  // Create a Slate editor object that won't change across renders
  const editor = useMemo(() => {
    const e = withHistory(withReact(createEditor())) as CustomEditor;
    
    // Override insertBreak to handle page breaks
    const { insertBreak, insertText } = e;
    
    e.insertBreak = () => {
      // First call the original insertBreak
      insertBreak();
    };
    
    e.insertText = (text) => {
      // Call the original insertText
      insertText(text);
    };

    return e;
  }, []);
  
  // Function to trigger pagination safely
  const triggerPagination = useCallback(() => {
    if (!editor || pageHeight <= 0 || isPaginatingRef.current || isInsideChangeHandlerRef.current) {
      return;
    }
    
    isPaginatingRef.current = true;
    
    // Import these functions dynamically to avoid circular dependencies
    import('./PageBreakHandler').then(({ handlePageBreaks, updatePageNumbers }) => {
      try {
        const changed = handlePageBreaks(editor, pageHeight);
        if (changed) {
          updatePageNumbers(editor);
        }
      } catch (error) {
        console.error('Error in pagination:', error);
      } finally {
        isPaginatingRef.current = false;
      }
    }).catch(error => {
      console.error('Failed to import PageBreakHandler:', error);
      isPaginatingRef.current = false;
    });
  }, [editor, pageHeight]);

  // Calculate page height once dimensions are available
  useEffect(() => {
    if (canvasRef.current && dimensions.height) {
      // Convert dimensions from string to number
      let height: number;
      if (typeof dimensions.height === 'string') {
        if (dimensions.height.includes('mm')) {
          height = parseFloat(dimensions.height) * 3.7795275591; // mm to px
        } else if (dimensions.height.includes('in')) {
          height = parseFloat(dimensions.height) * 96; // inches to px
        } else {
          height = parseFloat(dimensions.height);
        }
      } else {
        height = dimensions.height as number;
      }
      
      // Set page height for calculations
      setPageHeight(height);
    }
  }, [dimensions]);

  // Set up CSS variables for page dimensions
  useEffect(() => {
    document.documentElement.style.setProperty('--page-width', typeof dimensions.width === 'number' ? `${dimensions.width}px` : dimensions.width);
    document.documentElement.style.setProperty('--page-height', typeof dimensions.height === 'number' ? `${dimensions.height}px` : dimensions.height);
    document.documentElement.style.setProperty('--margin', '2cm');
  }, [dimensions]);

  // Handle value changes
  const handleChange = useCallback((newValue: Descendant[]) => {
    isInsideChangeHandlerRef.current = true;
    setSlateValue(newValue);
    
    // Convert Slate value to string for external state
    const slateContent = JSON.stringify(newValue);
    setContent(slateContent);
    
    // Auto save
    handleAutoSave();
    
    // Update word count
    const text = newValue
      .map(node => Node.string(node))
      .join(' ');
    
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    // Update page count
    const pageElements = newValue.filter(n => 
      n && typeof n === 'object' && 'type' in n && n.type === 'page'
    );
    setPageCount(Math.max(1, pageElements.length));
    
    // Track typing activity for toolbar visibility
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      
      // Only trigger pagination when typing stops and we're not already paginating
      if (!isPaginatingRef.current) {
        setTimeout(() => {
          triggerPagination();
        }, 100);
      }
    }, 1000);
    
    isInsideChangeHandlerRef.current = false;
  }, [handleAutoSave, setContent, triggerPagination]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return {
    editor,
    slateValue,
    setSlateValue,
    handleChange,
    canvasRef,
    editorRef,
    pageHeight,
    setPageHeight,
    wordCount,
    setWordCount,
    pageCount,
    setPageCount,
    isTyping,
    setIsTyping,
    typingTimeoutRef,
    triggerPagination,
    isPaginatingRef
  };
}
