import React, { useState, useMemo, useCallback } from 'react';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, Text, Node } from 'slate';
import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bold, Italic, Underline, Type, AlignLeft, AlignCenter, AlignRight, Palette, Grip, X, Plus } from 'lucide-react';
import { TextAlignment, LetterStyle } from '@/types/letter';
import { FontOption, FontSizeOption, ColorOption, PaperStyleOption, BorderStyleOption } from '@/types/letter';
import PaperStylePopover from '@/components/letter/PaperStylePopover';
import { usePaperStyle, PaperSizeOption } from '@/hooks/usePaperStyle';
import SlateColorPickerPopover from './SlateColorPickerPopover';
import './slateEditor.css';

// Define custom element types
type CustomElement = {
  type: 'paragraph' | 'page';
  children: CustomText[];
  align?: TextAlignment;
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  font?: string;
  size?: string;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const DEFAULT_INITIAL_VALUE: Descendant[] = [
  {
    type: 'page',
    children: [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ],
  },
];

const PAGE_HEIGHT = 1100; // Approximately A4 height in pixels

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
  paperStyleOptions: PaperStyleOption[];
  borderStyleOptions: BorderStyleOption[];
  fontOptions: FontOption[];
  fontSizeOptions: FontSizeOption[];
  colorOptions: ColorOption[];
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

  // Editor state
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [isToolbarDetached, setIsToolbarDetached] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [paperStylePopoverOpen, setPaperStylePopoverOpen] = useState(false);
  const [stylePopoverOpen, setStylePopoverOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [recentColors, setRecentColors] = useState<string[]>([]);

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
    
    // Update page count
    calculatePageCount(newValue);
  };

  // Calculate number of pages
  const calculatePageCount = (value: Descendant[]) => {
    // Count page blocks
    const pages = value.filter(node => SlateElement.isElement(node) && node.type === 'page');
    setPageCount(Math.max(1, pages.length));
  };

  // Toolbar visibility
  const handleMouseMove = () => {
    setIsToolbarVisible(true);
  };

  const toggleToolbarDetached = () => {
    setIsToolbarDetached(!isToolbarDetached);
    if (isToolbarDetached) {
      setToolbarPosition({ x: 0, y: 0 });
    }
  };

  // Start drag operation
  const startDrag = (event: React.PointerEvent) => {
    // Drag logic would go here
  };

  // Text formatting handlers
  const handleBold = () => {
    Editor.addMark(editor, 'bold', true);
  };

  const handleItalic = () => {
    Editor.addMark(editor, 'italic', true);
  };

  const handleUnderline = () => {
    Editor.addMark(editor, 'underline', true);
  };

  const handleColorChange = (color: string) => {
    Editor.addMark(editor, 'color', color);
    
    // Add to recent colors
    const updatedColors = [
      color,
      ...recentColors.filter(c => c !== color)
    ].slice(0, 3);
    
    setRecentColors(updatedColors);
    localStorage.setItem('recentTextColors', JSON.stringify(updatedColors));
  };

  const handleRemoveColor = () => {
    Editor.removeMark(editor, 'color');
  };

  const handleAddCustomColor = (color: string) => {
    handleColorChange(color);
  };

  // Handle zoom change
  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.min(Math.max(50, newZoom), 200));
  };

  // Load recent colors from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('recentTextColors');
    if (saved) {
      try {
        const colors = JSON.parse(saved);
        if (Array.isArray(colors)) {
          setRecentColors(colors.slice(0, 3));
        }
      } catch (e) {
        console.error('Error loading recent colors:', e);
      }
    }
  }, []);

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

  return (
    <div className="flex flex-col items-center" onMouseMove={handleMouseMove}>
      {/* Toolbar */}
      {isToolbarVisible && (
        <div
          className={`${!isToolbarDetached ? 'sticky top-0 w-full' : 'fixed'} z-50 mb-4 rounded-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border border-gray-100 dark:border-gray-800 py-2 px-4`}
          style={{
            left: isToolbarDetached ? toolbarPosition.x : 'auto',
            top: isToolbarDetached ? toolbarPosition.y : 0,
          }}
        >
          <div className="flex flex-wrap items-center gap-2">
            {/* Grip handle */}
            <div
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              onPointerDown={startDrag}
            >
              <Grip size={16} />
            </div>
            
            {/* Detach/attach button */}
            <button
              className={`p-1 rounded text-xs ${isToolbarDetached ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
              onClick={toggleToolbarDetached}
              title={isToolbarDetached ? "Attach toolbar" : "Detach toolbar"}
            >
              {isToolbarDetached ? "Attach" : "Detach"}
            </button>
            
            {/* Text formatting controls */}
            <FormatButton format="bold" icon={<Bold className="h-4 w-4" />} />
            <FormatButton format="italic" icon={<Italic className="h-4 w-4" />} />
            <FormatButton format="underline" icon={<Underline className="h-4 w-4" />} />
            
            {/* Text style popover */}
            <Popover open={stylePopoverOpen} onOpenChange={setStylePopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Type className="h-4 w-4 mr-2" />
                  Text Style
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium">Text Styling</h3>
                  
                  {/* Font family, size and alignment options would go here */}
                  {/* For brevity, these are not fully implemented in this example */}
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Color picker */}
            <SlateColorPickerPopover
              colorPickerOpen={colorPickerOpen} 
              setColorPickerOpen={setColorPickerOpen}
              onColorChange={handleColorChange}
              onRemoveColor={handleRemoveColor}
              onAddCustomColor={handleAddCustomColor}
              recentColors={recentColors}
              colorOptions={colorOptions}
            />
            
            {/* Paper style popover */}
            <PaperStylePopover
              paperStylePopoverOpen={paperStylePopoverOpen}
              setPaperStylePopoverOpen={setPaperStylePopoverOpen}
              paperStyleOptions={paperStyleOptions}
              borderStyleOptions={borderStyleOptions}
              letterStyle={letterStyle}
              updateLetterStyle={updateLetterStyle}
              paperSizeProps={{
                ...paperSizeProps,
                paperSize: paperSizeProps.paperSize,
                setPaperSize: paperSizeProps.setPaperSize,
                paperSizeOptions: paperSizeProps.paperSizeOptions as PaperSizeOption[],
                measurementUnit: paperSizeProps.measurementUnit,
                setMeasurementUnit: paperSizeProps.setMeasurementUnit
              }}
            />
          </div>
        </div>
      )}
      
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
      
      {/* Footer status bar */}
      <div className="mt-4 w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div>
          <span>{wordCount} words</span>
          <span className="mx-2">•</span>
          <span>{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span>Zoom:</span>
          <button 
            className="px-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => handleZoomChange(zoom - 10)}
            disabled={zoom <= 50}
          >
            -
          </button>
          <span>{zoom}%</span>
          <button 
            className="px-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => handleZoomChange(zoom + 10)}
            disabled={zoom >= 200}
          >
            +
          </button>
        </div>
      </div>
      
      {/* Keyboard shortcuts info */}
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        <p>Press <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">Ctrl+B</kbd> for bold • <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">Ctrl+I</kbd> for italic • <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">Ctrl+U</kbd> for underline • <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">ESC</kbd> to toggle toolbar</p>
      </div>
    </div>
  );
};

// Format button component for the toolbar
const FormatButton = ({ format, icon }: { format: string, icon: React.ReactNode }) => {
  const editor = useSlate();
  
  const isActive = () => {
    const marks = Editor.marks(editor);
    return marks ? marks[format as keyof typeof marks] === true : false;
  };
  
  const toggleFormat = (e: React.MouseEvent) => {
    e.preventDefault();
    const isActive = !!Editor.marks(editor)?.[format];
    
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };
  
  return (
    <Button
      variant={isActive() ? 'default' : 'outline'}
      size="sm"
      onMouseDown={toggleFormat}
    >
      {icon}
    </Button>
  );
};

// Page element component
const PageElement = ({ attributes, children, element, letterStyle, dimensions }: any) => {
  return (
    <div
      {...attributes}
      className={`${letterStyle.paperStyle} ${letterStyle.borderStyle} page texture shadow-paper scroll-snap-align-start mb-6`}
      style={{ 
        width: dimensions.width,
        minHeight: dimensions.height,
        padding: '2cm',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {children}
      <div className="absolute bottom-2 right-0 left-0 text-center text-xs text-gray-400">
        Page {/* Page number would be calculated here */}
      </div>
    </div>
  );
};

// Default element for paragraphs
const DefaultElement = ({ attributes, children }: any) => {
  return <p {...attributes}>{children}</p>;
};

// Leaf component for text formatting
const Leaf = ({ attributes, children, leaf }: any) => {
  let el = children;
  
  if (leaf.bold) {
    el = <strong>{el}</strong>;
  }
  
  if (leaf.italic) {
    el = <em>{el}</em>;
  }
  
  if (leaf.underline) {
    el = <u>{el}</u>;
  }
  
  if (leaf.color) {
    el = <span style={{ color: leaf.color }}>{el}</span>;
  }
  
  return <span {...attributes}>{el}</span>;
};

export default SlateEditor;
