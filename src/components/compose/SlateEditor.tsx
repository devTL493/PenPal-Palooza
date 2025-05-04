
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { createEditor, Descendant, Node, Editor, Transforms, Element as SlateElement, Text } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { TextAlignment, LetterStyle } from '@/types/letter';
import { usePaperStyle } from '@/hooks/usePaperStyle';
import './slateEditor.css';

// Import refactored components and types
import { DEFAULT_INITIAL_VALUE, CustomEditor } from './editor/types';
import { PageElement, DefaultElement } from './editor/Elements';
import Leaf from './editor/Leaf';
import EditorToolbar from './editor/EditorToolbar';
import EditorFooter from './editor/EditorFooter';
import { useEditorState } from './editor/useEditorState';
import { useSlateEditor } from './editor/SlateHooks';
import { getPageHeight } from './editor/PageBreakHandler';

interface SlateEditorProps {
  content: string;
  setContent: (content: string) => void;
  documentStyle: {
    font: string;
    size: string;
    color: string;
    alignment: TextAlignment;
  };
  letterStyle: LetterStyle;
  updateLetterStyle: (type: 'paperStyle' | 'borderStyle', value: string) => void;
  paperStyleOptions: any[];
  borderStyleOptions: any[];
  fontOptions: any[];
  fontSizeOptions: any[];
  colorOptions: any[];
  applyFormatting: (formatType: string, value: any) => void;
  insertLink: () => void;
  handleAutoSave: () => void;
}

const SlateEditor: React.FC<SlateEditorProps> = ({
  content,
  setContent,
  documentStyle,
  letterStyle,
  updateLetterStyle,
  paperStyleOptions,
  borderStyleOptions,
  fontOptions,
  fontSizeOptions,
  colorOptions,
  applyFormatting,
  insertLink,
  handleAutoSave,
}) => {
  // Editor state from custom hook
  const {
    isToolbarVisible,
    setIsToolbarVisible,
    isToolbarDetached,
    toolbarPosition,
    setToolbarPosition,
    wordCount,
    setWordCount,
    pageCount,
    setPageCount,
    zoom,
    toggleToolbarDetached,
    handleZoomChange
  } = useEditorState();

  // Track active formatting
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({
    bold: false,
    italic: false,
    underline: false
  });

  // Track text style properties
  const [textStyles, setTextStyles] = useState({
    fontFamily: 'serif',
    fontSize: '16px',
    lineSpacing: '1.15',
    alignment: 'left' as 'left' | 'center' | 'right' | 'justify'
  });

  // For page break calculation
  const canvasRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [pageHeight, setPageHeight] = useState(0);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Paper style settings
  const paperSizeProps = usePaperStyle();
  const { getPaperDimensions } = paperSizeProps;
  const dimensions = getPaperDimensions();

  // Create a Slate editor object that won't change across renders
  const editor = useMemo(() => {
    const e = withHistory(withReact(createEditor())) as CustomEditor;
    
    // Override insertBreak to handle page breaks
    const { insertBreak } = e;
    e.insertBreak = () => {
      insertBreak();
      
      // Check for page breaks after inserting a line break
      setTimeout(() => {
        slateEditorUtils.paginateContent();
      }, 0);
    };
    
    return e;
  }, [pageHeight]);
  
  // Get all editor utilities from our custom hook
  const slateEditorUtils = useSlateEditor(editor, pageHeight);

  // Define custom element renderer
  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case 'page':
        const pageProps = {
          ...props,
          letterStyle,
          dimensions,
          pageNumber: props.element.pageNumber,
          pageCount: props.element.pageCount || 1
        };
        return <PageElement {...pageProps} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, [letterStyle, dimensions]);

  // Define custom leaf renderer for text formatting
  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);

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
    slateEditorUtils.setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      slateEditorUtils.setIsTyping(false);
    }, 1500);
    
    // Check for page overflows
    slateEditorUtils.paginateContent();
  };

  // Toolbar visibility
  const handleMouseMove = () => {
    if (!slateEditorUtils.isTyping) {
      setIsToolbarVisible(true);
    }
  };

  // Start drag operation
  const startDrag = (event: React.PointerEvent) => {
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = toolbarPosition.x;
    const startTop = toolbarPosition.y;
    
    const handleMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      const newX = startLeft + deltaX;
      const newY = startTop + deltaY;
      
      setToolbarPosition({
        x: Math.max(0, newX),
        y: Math.max(0, newY)
      });
    };
    
    const handleUp = () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
    };
    
    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
  };

  // Handle format toggling from the toolbar
  const handleFormatToggle = (format: string) => {
    // Save selection before applying format
    slateEditorUtils.saveCurrentSelection();
    
    // Restore selection
    slateEditorUtils.restoreSelection();
    
    if (activeFormats[format]) {
      editor.removeMark(format);
    } else {
      editor.addMark(format, true);
    }
    
    // Update the active formats state
    setActiveFormats(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };

  // Text style handlers
  const handleFontFamilyChange = (value: string) => {
    // Save and restore selection
    slateEditorUtils.saveCurrentSelection();
    slateEditorUtils.restoreSelection();
    
    editor.addMark('fontFamily', value);
    setTextStyles(prev => ({ ...prev, fontFamily: value }));
    
    // Check pagination after style changes
    slateEditorUtils.paginateContent();
  };

  const handleFontSizeChange = (value: string) => {
    // Save and restore selection
    slateEditorUtils.saveCurrentSelection();
    slateEditorUtils.restoreSelection();
    
    editor.addMark('fontSize', value);
    setTextStyles(prev => ({ ...prev, fontSize: value }));
    
    // Check pagination after style changes
    slateEditorUtils.paginateContent();
  };

  const handleLineSpacingChange = (value: string) => {
    // Save and restore selection
    slateEditorUtils.saveCurrentSelection();
    slateEditorUtils.restoreSelection();
    
    editor.addMark('lineHeight', value);
    setTextStyles(prev => ({ ...prev, lineSpacing: value }));
    
    // Check pagination after style changes
    slateEditorUtils.paginateContent();
  };

  const handleAlignmentChange = (value: 'left' | 'center' | 'right' | 'justify') => {
    // Save and restore selection
    slateEditorUtils.saveCurrentSelection();
    slateEditorUtils.restoreSelection();
    
    Transforms.setNodes(
      editor,
      { align: value },
      { match: n => SlateElement.isElement(n) && n.type === 'paragraph' }
    );
    setTextStyles(prev => ({ ...prev, alignment: value }));
    
    // Check pagination after style changes
    slateEditorUtils.paginateContent();
  };

  // Escape key to show toolbar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsToolbarVisible(true);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);
  
  // Handle the opening and closing of popovers
  useEffect(() => {
    if (slateEditorUtils.colorPickerOpen || slateEditorUtils.paperStylePopoverOpen || slateEditorUtils.stylePopoverOpen) {
      slateEditorUtils.saveCurrentSelection();
    }
  }, [slateEditorUtils.colorPickerOpen, slateEditorUtils.paperStylePopoverOpen, slateEditorUtils.stylePopoverOpen]);

  // Update active formats when selection changes
  useEffect(() => {
    const updateActiveFormats = () => {
      const marks = editor.marks || {};
      setActiveFormats({
        bold: !!marks.bold,
        italic: !!marks.italic,
        underline: !!marks.underline
      });
      
      // Also update text styles
      if (marks.fontFamily) {
        setTextStyles(prev => ({ ...prev, fontFamily: marks.fontFamily as string }));
      }
      if (marks.fontSize) {
        setTextStyles(prev => ({ ...prev, fontSize: marks.fontSize as string }));
      }
      if (marks.lineHeight) {
        setTextStyles(prev => ({ ...prev, lineSpacing: marks.lineHeight as string }));
      }
      
      // For alignment, we need to look at the current selection's paragraph
      try {
        const [match] = Editor.nodes(editor, {
          match: n => SlateElement.isElement(n) && n.type === 'paragraph',
        });
        
        if (match) {
          const [node] = match;
          if ('align' in node) {
            const alignment = node.align as 'left' | 'center' | 'right' | 'justify' || 'left';
            setTextStyles(prev => ({ ...prev, alignment }));
          }
        }
      } catch (err) {
        console.log('No selection or paragraph found');
      }
    };

    // Set up an interval to check for selection changes
    const interval = setInterval(updateActiveFormats, 100);
    return () => clearInterval(interval);
  }, [editor]);

  // Set up CSS variables for page dimensions
  useEffect(() => {
    document.documentElement.style.setProperty('--page-width', typeof dimensions.width === 'number' ? `${dimensions.width}px` : dimensions.width);
    document.documentElement.style.setProperty('--page-height', typeof dimensions.height === 'number' ? `${dimensions.height}px` : dimensions.height);
    document.documentElement.style.setProperty('--margin', '2cm');
  }, [dimensions]);

  return (
    <div 
      className="flex flex-col items-center" 
      onMouseMove={handleMouseMove}
      ref={editorRef}
    >
      <Slate
        editor={editor}
        value={slateValue}
        onChange={handleChange}
      >
        {/* Editor Toolbar */}
        <EditorToolbar
          isToolbarVisible={isToolbarVisible}
          isToolbarDetached={isToolbarDetached}
          toolbarPosition={toolbarPosition}
          toggleToolbarDetached={toggleToolbarDetached}
          startDrag={startDrag}
          colorPickerOpen={slateEditorUtils.colorPickerOpen}
          setColorPickerOpen={(open) => {
            if (open) slateEditorUtils.saveCurrentSelection();
            slateEditorUtils.setColorPickerOpen(open);
          }}
          onColorChange={slateEditorUtils.handleColorChange}
          onRemoveColor={slateEditorUtils.handleRemoveColor}
          onAddCustomColor={slateEditorUtils.handleColorChange}
          recentColors={slateEditorUtils.recentColors}
          colorOptions={colorOptions}
          paperStylePopoverOpen={slateEditorUtils.paperStylePopoverOpen}
          setPaperStylePopoverOpen={(open) => {
            if (open) slateEditorUtils.saveCurrentSelection();
            slateEditorUtils.setPaperStylePopoverOpen(open);
          }}
          paperStyleOptions={paperStyleOptions}
          borderStyleOptions={borderStyleOptions}
          letterStyle={letterStyle}
          updateLetterStyle={updateLetterStyle}
          paperSizeProps={paperSizeProps}
          stylePopoverOpen={slateEditorUtils.stylePopoverOpen}
          setStylePopoverOpen={(open) => {
            if (open) slateEditorUtils.saveCurrentSelection();
            slateEditorUtils.setStylePopoverOpen(open);
          }}
          activeFormats={activeFormats}
          onFormatToggle={handleFormatToggle}
          textStyles={textStyles}
          onFontFamilyChange={handleFontFamilyChange}
          onFontSizeChange={handleFontSizeChange}
          onLineSpacingChange={handleLineSpacingChange}
          onAlignmentChange={handleAlignmentChange}
          handleMouseDown={slateEditorUtils.handleMouseDown}
        />
        
        {/* Canvas with scroll snap */}
        <div 
          ref={canvasRef}
          className="canvas word-processor-canvas w-full overflow-auto h-[calc(100vh-200px)]"
          style={{ 
            scrollSnapType: 'y mandatory',
            position: 'relative',
          }}
        >
          <div 
            className="pages-container"
            style={{
              transform: `scale(${zoom/100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={slateEditorUtils.handleKeyDown}
              onPaste={slateEditorUtils.handlePasteWithPagination}
              spellCheck
              className="outline-none cursor-text"
            />
          </div>
        </div>
        
        {/* Editor Footer */}
        <EditorFooter
          wordCount={wordCount}
          pageCount={pageCount}
          zoom={zoom}
          handleZoomChange={handleZoomChange}
        />
      </Slate>
    </div>
  );
};

export default SlateEditor;
