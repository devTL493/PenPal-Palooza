import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import TextFormattingToolbar from '@/components/letter/TextFormattingToolbar';
import PaperStylePopover from '@/components/letter/PaperStylePopover';
import LinkPopover from '@/components/letter/LinkPopover';
import LetterPreview from '@/components/letter/LetterPreview';
import { InlineStyle, TextAlignment } from '@/types/letter';
import { useLetterFormatting } from '@/hooks/useLetterFormatting';
import useTextSelection from '@/hooks/useTextSelection';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { PaperSizeOption } from '@/hooks/usePaperStyle';
import { Grip, Ruler, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ColorPickerPopover from '@/components/letter/ColorPickerPopover';

interface EnhancedPaperEditorProps {
  content: string;
  setContent: (content: string) => void;
  onSend?: () => void;
}

const EnhancedPaperEditor: React.FC<EnhancedPaperEditorProps> = ({
  content,
  setContent,
  onSend
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  
  // Toolbar positioning state
  const [isToolbarDetached, setIsToolbarDetached] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  
  // Pro features state
  const [showRulers, setShowRulers] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  
  // Color picker state
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  
  // Selection preservation
  const [savedSelection, setSavedSelection] = useState<{start: number, end: number} | null>(null);
  const [lastSelection, setLastSelection] = useState<Range | null>(null);
  
  // Initialize letter formatting hooks
  const letterFormatting = useLetterFormatting({
    initialDocumentStyle: {
      font: 'font-mono', // Typewriter-style font
      size: 'text-lg',
      color: 'text-black',
      alignment: 'text-left'
    }
  });
  
  const {
    documentStyle,
    inlineStyles,
    letterStyle,
    linkPopoverOpen,
    setLinkPopoverOpen,
    linkText,
    setLinkText,
    linkUrl,
    setLinkUrl,
    stylePopoverOpen,
    setStylePopoverOpen,
    paperStylePopoverOpen,
    setPaperStylePopoverOpen,
    updateLetterStyle,
    applyFormatting,
    insertLink,
    paperSizeProps,
    isToolbarVisible,
    setIsToolbarVisible,
    handleContentChange,
    handleMouseMove,
    colorPickerOpen,
    setColorPickerOpen
  } = letterFormatting;

  // Text selection state management
  const textSelection = useTextSelection({
    editorRef,
    content,
    inlineStyles,
    documentStyle
  });
  
  const {
    selectionRange,
    activeTextFormat,
    setSelectionRange
  } = textSelection;

  // Get actual paper dimensions
  const { getPaperDimensions } = paperSizeProps;
  const dimensions = getPaperDimensions();

  // Font and styling options
  const fontOptions = [
    { value: 'font-mono', label: 'Courier Prime' },
    { value: 'font-serif', label: 'Serif' },
    { value: 'font-sans', label: 'Sans' }
  ];
  
  const fontSizeOptions = [
    { value: 'text-sm', label: 'Small' },
    { value: 'text-base', label: 'Medium' },
    { value: 'text-lg', label: 'Large' },
    { value: 'text-xl', label: 'X-Large' },
  ];
  
  useEffect(() => {
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
  
  const colorOptions = [
    { value: 'text-black', label: 'Black', color: '#000000' },
    { value: 'text-blue-600', label: 'Blue', color: '#2563eb' },
    { value: 'text-red-600', label: 'Red', color: '#dc2626' },
    { value: 'text-green-600', label: 'Green', color: '#16a34a' },
    { value: 'text-purple-600', label: 'Purple', color: '#9333ea' },
    { value: 'text-amber-600', label: 'Amber', color: '#d97706' },
    { value: 'text-pink-600', label: 'Pink', color: '#db2777' },
    { value: 'text-cyan-600', label: 'Cyan', color: '#0891b2' },
    { value: 'text-emerald-600', label: 'Emerald', color: '#059669' },
    { value: 'text-indigo-600', label: 'Indigo', color: '#4f46e5' },
    { value: 'text-rose-600', label: 'Rose', color: '#e11d48' },
    { value: 'text-sky-600', label: 'Sky', color: '#0284c7' },
    { value: 'text-teal-600', label: 'Teal', color: '#0d9488' },
    { value: 'text-violet-600', label: 'Violet', color: '#7c3aed' },
    { value: 'text-slate-600', label: 'Slate', color: '#475569' },
    { value: 'text-gray-600', label: 'Gray', color: '#4b5563' },
    ...recentColors.map((color) => ({
      value: color,
      label: 'Custom',
      color: color,
      isCustom: true
    }))
  ];
  
  const paperStyleOptions = [
    { value: 'bg-paper', label: 'White', description: 'Clean white paper' },
    { value: 'bg-cream', label: 'Cream', description: 'Warm cream-colored paper' },
    { value: 'bg-vintage', label: 'Vintage', description: 'Aged vintage-look paper' }
  ];
  
  const borderStyleOptions = [
    { value: 'border-none', label: 'None', description: 'No border' },
    { value: 'border-simple', label: 'Simple', description: 'Clean, minimal border' },
    { value: 'border-ornate', label: 'Ornate', description: 'Decorative ornamental border' }
  ];
  
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        setLastSelection(range.cloneRange());
      }
    };

    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('keyup', handleSelectionChange);
    
    return () => {
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('keyup', handleSelectionChange);
    };
  }, []);
  
  // Prevent mouse down from losing focus by preventing default
  const handleToolbarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };
  
  const handleApplyFormattingWithSelection = (formatType: string, value: any) => {
    // Restore selection if available
    if (lastSelection) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(lastSelection);
      }
    }
    
    // Now apply the formatting
    applyFormatting(formatType, value);
  };
  
  // Handle new color addition
  const handleAddCustomColor = (color: string) => {
    // Add to recent colors, keep only the 3 most recent
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== color); // Remove if already exists
      const updated = [color, ...filtered].slice(0, 3); // Add to front, keep only 3
      
      // Save to localStorage
      localStorage.setItem('recentTextColors', JSON.stringify(updated));
      return updated;
    });
    
    // Apply color to selection
    if (lastSelection) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(lastSelection);
      }
      applyFormatting('color', color);
    }
  };
  
  // Function to start drag operation
  const startDrag = (event: React.PointerEvent) => {
    dragControls.start(event, { snapToCursor: false });
  };
  
  // Toggle toolbar detached state
  const toggleToolbarDetached = () => {
    setIsToolbarDetached(!isToolbarDetached);
    // Reset position when re-attaching
    if (isToolbarDetached) {
      setToolbarPosition({ x: 0, y: 0 });
    }
  };

  // Create a wrapper for insertLink that matches the expected signature
  const handleInsertLink = () => {
    if (linkUrl) {
      insertLink(linkUrl);
    }
  };
  
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setAttribute('contenteditable', 'true');
      editorRef.current.setAttribute('spellcheck', 'true');
    }
  }, []);
  
  // Handle editor input to update content
  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setContent(newContent);
    handleContentChange();
    
    // Update word count
    const text = e.currentTarget.textContent || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    // Update page count based on content height
    updatePageCount();
  };
  
  const updatePageCount = useCallback(() => {
    if (!editorRef.current || !paperRef.current) return;
    
    const contentHeight = editorRef.current.scrollHeight;
    const pageHeight = parseFloat(dimensions.height) * 3.7795275591; // Convert mm to px
    const marginSize = '2cm'; // Standard margin size
    const marginInPx = parseFloat(marginSize) * 37.7952; // Convert cm to px (approximate)
    
    // Available height per page (subtracting margins)
    const pageInnerHeight = pageHeight - (marginInPx * 2); 
    
    // Calculate pages needed
    const pagesNeeded = Math.max(1, Math.ceil(contentHeight / pageInnerHeight));
    setPageCount(pagesNeeded);
  }, [dimensions.height]);
  
  // Update page count when content changes
  useEffect(() => {
    updatePageCount();
  }, [content, updatePageCount]);
  
  // Determine current page from scroll position
  const handleScroll = useCallback(() => {
    if (!canvasRef.current) return;
    
    const scrollTop = canvasRef.current.scrollTop;
    const pageHeight = parseFloat(dimensions.height) * 3.7795275591; // Convert mm to px
    const currentPageNumber = Math.floor(scrollTop / pageHeight) + 1;
    
    setCurrentPage(Math.min(currentPageNumber, pageCount));
  }, [dimensions.height, pageCount]);
  
  // Add scroll event listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('scroll', handleScroll);
      return () => canvas.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Ctrl/Command key is pressed
      if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            handleApplyFormattingWithSelection('bold', null);
            break;
          case 'i':
            e.preventDefault();
            handleApplyFormattingWithSelection('italic', null);
            break;
          case 'u':
            e.preventDefault();
            handleApplyFormattingWithSelection('underline', null);
            break;
          case 'escape':
          case 'esc':
            e.preventDefault();
            setIsToolbarVisible(!isToolbarVisible);
            break;
        }
      } else if (e.key === 'Escape') {
        setIsToolbarVisible(!isToolbarVisible);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleApplyFormattingWithSelection, isToolbarVisible, setIsToolbarVisible]);
  
  // Toggle rulers
  const toggleRulers = () => {
    setShowRulers(!showRulers);
  };
  
  // Handle zoom change
  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.min(Math.max(50, newZoom), 200));
  };
  
  return (
    <div className="flex flex-col items-center" onMouseMove={handleMouseMove}>
      {/* Toolbar (appears on hover/selection) */}
      <AnimatePresence>
        {isToolbarVisible && (
          <motion.div 
            ref={toolbarRef}
            className={`${!isToolbarDetached ? 'sticky top-0 w-full' : ''} z-50 mb-4 rounded-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border border-gray-100 dark:border-gray-800 py-2 px-4 toolbar-mousedown-prevent`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: 1, 
              y: isToolbarDetached ? toolbarPosition.y : 0,
              x: isToolbarDetached ? toolbarPosition.x : 0,
              position: isToolbarDetached ? 'fixed' : 'sticky',
            }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            drag={isToolbarDetached}
            dragControls={dragControls}
            dragMomentum={false}
            dragConstraints={{ left: 0, right: window.innerWidth - 300, top: 0, bottom: window.innerHeight - 80 }}
            onDragEnd={(_, info) => {
              if (isToolbarDetached) {
                setToolbarPosition({
                  x: toolbarPosition.x + info.offset.x,
                  y: toolbarPosition.y + info.offset.y
                });
              }
            }}
            onMouseDown={handleToolbarMouseDown}
          >
            <div className="flex flex-wrap items-center gap-2">
              {/* Grip handle for dragging */}
              <div 
                className={`cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700`}
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
              
              <TextFormattingToolbar
                selectionRange={selectionRange}
                activeTextFormat={activeTextFormat}
                fontOptions={fontOptions}
                fontSizeOptions={fontSizeOptions}
                colorOptions={colorOptions}
                stylePopoverOpen={stylePopoverOpen}
                setStylePopoverOpen={setStylePopoverOpen}
                applyFormatting={handleApplyFormattingWithSelection}
              />
              
              <ColorPickerPopover
                colorPickerOpen={colorPickerOpen}
                setColorPickerOpen={setColorPickerOpen}
                selectionRange={selectionRange}
                onAddCustomColor={handleAddCustomColor}
                recentColors={recentColors}
                colorOptions={colorOptions}
                applyFormatting={handleApplyFormattingWithSelection}
              />
              
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
              
              <LinkPopover
                linkPopoverOpen={linkPopoverOpen}
                setLinkPopoverOpen={setLinkPopoverOpen}
                selectionRange={selectionRange}
                linkUrl={linkUrl}
                setLinkUrl={setLinkUrl}
                linkText={linkText}
                setLinkText={setLinkText}
                onInsertLink={handleInsertLink}
              />
              
              {/* Ruler toggle button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleRulers}
                className={showRulers ? 'bg-muted' : ''}
              >
                <Ruler className="h-4 w-4 mr-2" />
                Rulers
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Canvas with scroll snap */}
      <div 
        ref={canvasRef}
        className="word-processor-canvas w-full overflow-auto h-[calc(100vh-200px)]"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {/* Rulers (conditionally rendered) */}
        {showRulers && (
          <div className="rulers-container">
            <div className="horizontal-ruler"></div>
            <div className="vertical-ruler"></div>
          </div>
        )}
        
        {/* Paper */}
        <div className="flex justify-center">
          {/* The paper/page container */}
          <div 
            className="pages-container"
            style={{
              transform: `scale(${zoom/100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            {/* Generate pages based on pageCount */}
            {Array.from({ length: pageCount }).map((_, index) => (
              <div 
                key={`page-${index + 1}`}
                ref={index === 0 ? paperRef : undefined}
                className={`${letterStyle.paperStyle} ${letterStyle.borderStyle} page texture shadow-paper scroll-snap-align-start mb-6 cursor-text`}
                style={{ 
                  width: dimensions.width,
                  minHeight: dimensions.height,
                  height: 'auto',
                  padding: '2cm',
                  boxSizing: 'border-box',
                  position: 'relative'
                }}
              >
                {/* Only the first page is editable, others are visual placeholders */}
                {index === 0 ? (
                  <div 
                    ref={editorRef}
                    className={`${documentStyle.font} first-line-indent`}
                    onInput={handleEditorInput}
                    style={{ 
                      minHeight: `calc(${dimensions.height} - 4cm)`,
                      outline: 'none',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.5
                    }}
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <div 
                    className={`${documentStyle.font} first-line-indent`}
                    style={{ 
                      minHeight: `calc(${dimensions.height} - 4cm)`,
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.5
                    }}
                  >
                    {/* Visual placeholder for additional pages */}
                  </div>
                )}
                
                {/* Page footer */}
                <div className="absolute bottom-2 right-0 left-0 text-center text-xs text-gray-400">
                  Page {index + 1} of {pageCount}
                </div>
              </div>
            ))}
          </div>
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
      
      {/* Mobile controls for small screens */}
      <div className="md:hidden mt-4 w-full">
        <button 
          className="w-full py-2 px-4 bg-primary text-white rounded-md"
          onClick={() => setIsToolbarVisible(!isToolbarVisible)}
        >
          Toggle Toolbar
        </button>
      </div>
    </div>
  );
};

export default EnhancedPaperEditor;
