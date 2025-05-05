
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

  // Create a Slate editor object that won't change across renders
  const editor = useMemo(() => {
    const e = withHistory(withReact(createEditor())) as CustomEditor;
    
    // Override insertBreak to handle page breaks
    const { insertBreak } = e;
    e.insertBreak = () => {
      insertBreak();
      
      // Check for page breaks after inserting a line break
      setTimeout(() => {
        // We'll call paginateContent from the parent component
      }, 0);
    };

    // Add custom event handlers to enable copy/paste
    const { onChange } = e;
    e.onChange = () => {
      if (onChange) {
        onChange();
      }
    };
    
    return e;
  }, [pageHeight]);

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
  const handleChange = (newValue: Descendant[]) => {
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
    }, 1500);
  };

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
    typingTimeoutRef
  };
}
