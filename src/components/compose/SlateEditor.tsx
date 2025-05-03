
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { createEditor, Descendant, Node } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { TextAlignment, LetterStyle } from '@/types/letter';
import { usePaperStyle } from '@/hooks/usePaperStyle';
import './slateEditor.css';

// Import refactored components and types
import { DEFAULT_INITIAL_VALUE } from './editor/types';
import { PageElement, DefaultElement } from './editor/Elements';
import Leaf from './editor/Leaf';
import EditorToolbar from './editor/EditorToolbar';
import EditorFooter from './editor/EditorFooter';
import { useEditorState } from './editor/useEditorState';

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
    colorPickerOpen,
    setColorPickerOpen,
    paperStylePopoverOpen,
    setPaperStylePopoverOpen,
    stylePopoverOpen,
    setStylePopoverOpen,
    wordCount,
    setWordCount,
    pageCount,
    setPageCount,
    zoom,
    recentColors,
    setRecentColors,
    toggleToolbarDetached,
    handleZoomChange
  } = useEditorState();

  // Track active formatting
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({
    bold: false,
    italic: false,
    underline: false
  });

  // Parse content for Slate
  const [slateValue, setSlateValue] = useState<Descendant[]>(() => {
    try {
      // Try to parse existing content as Slate value
      if (content && content.trim()) {
        // If content has HTML formatting, convert it to Slate format
        if (content.includes('<')) {
          // This is a simplified approach; real implementation would need 
          // a proper HTML-to-Slate converter
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
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Define custom element renderer
  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case 'page':
        return <PageElement {...props} letterStyle={letterStyle} dimensions={dimensions} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, [letterStyle, dimensions]);

  // Define custom leaf renderer for text formatting
  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);

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
    
    // Update page count - simpler implementation
    const pageElements = newValue.filter(n => 
      n && typeof n === 'object' && 'type' in n && n.type === 'page'
    );
    setPageCount(Math.max(1, pageElements.length));
  };

  // Toolbar visibility
  const handleMouseMove = () => {
    setIsToolbarVisible(true);
  };

  // Start drag operation
  const startDrag = (event: React.PointerEvent) => {
    // Drag logic would go here
  };

  // Handle format toggling from the toolbar
  const handleFormatToggle = (format: string) => {
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

  // Text formatting handlers
  const handleBold = () => {
    handleFormatToggle('bold');
  };

  const handleItalic = () => {
    handleFormatToggle('italic');
  };

  const handleUnderline = () => {
    handleFormatToggle('underline');
  };

  const handleColorChange = (color: string) => {
    editor.addMark('color', color);
    
    // Add to recent colors
    const updatedColors = [
      color,
      ...recentColors.filter(c => c !== color)
    ].slice(0, 3);
    
    setRecentColors(updatedColors);
    localStorage.setItem('recentTextColors', JSON.stringify(updatedColors));
  };

  const handleRemoveColor = () => {
    editor.removeMark('color');
  };

  const handleAddCustomColor = (color: string) => {
    handleColorChange(color);
  };

  // Keyboard shortcuts
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!event.ctrlKey && !event.metaKey) return;
    
    switch (event.key) {
      case 'b': {
        event.preventDefault();
        handleBold();
        break;
      }
      case 'i': {
        event.preventDefault();
        handleItalic();
        break;
      }
      case 'u': {
        event.preventDefault();
        handleUnderline();
        break;
      }
    }
  };

  // Update active formats when selection changes
  useEffect(() => {
    const updateActiveFormats = () => {
      const marks = editor.marks || {};
      setActiveFormats({
        bold: !!marks.bold,
        italic: !!marks.italic,
        underline: !!marks.underline
      });
    };

    // We need a way to hook into Slate's selection changes
    // Since there's no direct way, we'll check periodically
    const interval = setInterval(updateActiveFormats, 100);
    return () => clearInterval(interval);
  }, [editor]);

  return (
    <div className="flex flex-col items-center" onMouseMove={handleMouseMove}>
      {/* Editor Toolbar */}
      <EditorToolbar
        isToolbarVisible={isToolbarVisible}
        isToolbarDetached={isToolbarDetached}
        toolbarPosition={toolbarPosition}
        toggleToolbarDetached={toggleToolbarDetached}
        startDrag={startDrag}
        colorPickerOpen={colorPickerOpen}
        setColorPickerOpen={setColorPickerOpen}
        onColorChange={handleColorChange}
        onRemoveColor={handleRemoveColor}
        onAddCustomColor={handleAddCustomColor}
        recentColors={recentColors}
        colorOptions={colorOptions}
        paperStylePopoverOpen={paperStylePopoverOpen}
        setPaperStylePopoverOpen={setPaperStylePopoverOpen}
        paperStyleOptions={paperStyleOptions}
        borderStyleOptions={borderStyleOptions}
        letterStyle={letterStyle}
        updateLetterStyle={updateLetterStyle}
        paperSizeProps={paperSizeProps}
        stylePopoverOpen={stylePopoverOpen}
        setStylePopoverOpen={setStylePopoverOpen}
        activeFormats={activeFormats}
        onFormatToggle={handleFormatToggle}
      />
      
      {/* Canvas with scroll snap */}
      <div 
        className="canvas w-full overflow-auto h-[calc(100vh-200px)]"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        <div 
          className="pages-container"
          style={{
            transform: `scale(${zoom/100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-in-out'
          }}
        >
          <Slate
            editor={editor}
            value={slateValue}
            onChange={handleChange}
          >
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={handleKeyDown}
              spellCheck
              className="outline-none"
            />
          </Slate>
        </div>
      </div>
      
      {/* Editor Footer */}
      <EditorFooter
        wordCount={wordCount}
        pageCount={pageCount}
        zoom={zoom}
        handleZoomChange={handleZoomChange}
      />
    </div>
  );
};

export default SlateEditor;
