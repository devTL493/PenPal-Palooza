
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
import { Grip, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    handleMouseMove
  } = letterFormatting;

  // Text selection state management
  const textSelection = useTextSelection({
    textareaRef,
    content,
    inlineStyles,
    documentStyle
  });
  
  const {
    selectionRange,
    activeTextFormat
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
  
  const colorOptions = [
    { value: 'text-black', label: 'Black', color: '#000000' },
    { value: 'text-blue-600', label: 'Blue', color: '#2563eb' },
    { value: 'text-red-600', label: 'Red', color: '#dc2626' },
    { value: 'text-green-600', label: 'Green', color: '#16a34a' }
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
  
  // Focus the textarea when clicking anywhere on the paper
  const handlePaperClick = (e: React.MouseEvent) => {
    if (textareaRef.current && e.target === paperRef.current) {
      textareaRef.current.focus();
    }
  };
  
  // Make sure toolbar is visible on selection
  useEffect(() => {
    if (selectionRange) {
      setIsToolbarVisible(true);
    }
  }, [selectionRange, setIsToolbarVisible]);
  
  // Apply formatting handler
  const handleApplyFormatting = (formatType: string, value: any) => {
    applyFormatting(formatType, value, selectionRange, activeTextFormat);
  };
  
  // Link insertion handler
  const handleInsertLink = () => {
    insertLink(selectionRange, linkUrl);
  };
  
  // Calculate responsive dimensions
  const viewportWidth = window.innerWidth;
  const maxWidth = Math.min(parseFloat(dimensions.width), viewportWidth * 0.9);
  const scale = maxWidth / parseFloat(dimensions.width);
  
  // Calculate margins for the paper (default to 24mm margins)
  const marginSize = paperSizeProps.measurementUnit === 'mm' ? '24mm' : '1in';
  
  // Word count calculation
  useEffect(() => {
    if (!content) {
      setWordCount(0);
      return;
    }
    
    const words = content.trim().split(/\s+/);
    setWordCount(words.length);
  }, [content]);
  
  // Page count estimation (rough calculation)
  useEffect(() => {
    if (!textareaRef.current || !content) {
      setPageCount(1);
      return;
    }
    
    const avgCharsPerPage = 2000; // Rough estimate
    const totalChars = content.length;
    const estimatedPages = Math.max(1, Math.ceil(totalChars / avgCharsPerPage));
    setPageCount(estimatedPages);
  }, [content]);
  
  // Keyboard shortcuts for formatting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Ctrl/Command key is pressed
      if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            handleApplyFormatting('bold', null);
            break;
          case 'i':
            e.preventDefault();
            handleApplyFormatting('italic', null);
            break;
          case 'u':
            e.preventDefault();
            handleApplyFormatting('underline', null);
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
  }, [handleApplyFormatting, isToolbarVisible, setIsToolbarVisible]);
  
  // Toggle rulers
  const toggleRulers = () => {
    setShowRulers(!showRulers);
  };
  
  // Handle zoom change
  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.min(Math.max(50, newZoom), 200));
  };
  
  // Determine current page from scroll position
  const handleScroll = useCallback(() => {
    if (!canvasRef.current) return;
    
    const scrollTop = canvasRef.current.scrollTop;
    const pageHeight = parseFloat(dimensions.height);
    const currentPageNumber = Math.floor(scrollTop / pageHeight) + 1;
    
    setCurrentPage(currentPageNumber);
  }, [dimensions.height]);
  
  // Add scroll event listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('scroll', handleScroll);
      return () => canvas.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);
  
  return (
    <div className="flex flex-col items-center" onMouseMove={handleMouseMove}>
      {/* Toolbar (appears on hover/selection) */}
      <AnimatePresence>
        {isToolbarVisible && (
          <motion.div 
            ref={toolbarRef}
            className={`${!isToolbarDetached ? 'sticky top-0 w-full' : ''} z-50 mb-4 rounded-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border border-gray-100 dark:border-gray-800 py-2 px-4`}
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
                applyFormatting={handleApplyFormatting}
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
        className="word-processor-canvas w-full overflow-auto scroll-smooth max-h-[calc(100vh-200px)]"
        style={{ scrollSnapType: 'y proximity' }}
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
            {/* First page */}
            <Card 
              ref={paperRef}
              className={`${letterStyle.paperStyle} ${letterStyle.borderStyle} page texture shadow-paper overflow-hidden transition-all duration-300 relative mb-6`}
              style={{ 
                width: dimensions.width,
                height: dimensions.height,
                scrollSnapAlign: 'start',
                scrollMarginTop: '1rem'
              }}
              onClick={handlePaperClick}
            >
              <CardContent 
                className="p-0 h-full relative"
                style={{ padding: marginSize }}
              >
                {/* Text overlay for styling */}
                <div 
                  className="absolute inset-0 z-10 pointer-events-none overflow-auto" 
                  style={{ 
                    padding: marginSize,
                    textIndent: '1.27cm', 
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  <LetterPreview
                    content={content}
                    documentStyle={documentStyle}
                    inlineStyles={inlineStyles}
                    scrollToQuoteInConversation={() => {}}
                    isPreview={false}
                  />
                </div>
                
                {/* Actual textarea for input */}
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    handleContentChange();
                  }}
                  className={`w-full h-full resize-none bg-transparent z-20 relative ${documentStyle.font} focus:outline-none`}
                  style={{ 
                    caretColor: documentStyle.color === 'text-white' ? '#FFFFFF' : '#000000',
                    color: 'transparent',
                    lineHeight: '1.5',
                    textIndent: '1.27cm',
                    whiteSpace: 'pre-wrap',
                  }}
                  placeholder="Start writing your letter..."
                  onClick={() => setIsToolbarVisible(true)}
                  spellCheck={true}
                />
                
                {/* Page footer */}
                <div className="absolute bottom-2 right-0 left-0 text-center text-xs text-gray-400">
                  Page {currentPage} of {pageCount}
                </div>
              </CardContent>
            </Card>
            
            {/* Add more pages based on content overflow */}
            {Array.from({ length: pageCount - 1 }).map((_, index) => (
              <Card 
                key={`page-${index + 2}`}
                className={`${letterStyle.paperStyle} ${letterStyle.borderStyle} page texture shadow-paper overflow-hidden transition-all duration-300 relative mb-6`}
                style={{ 
                  width: dimensions.width,
                  height: dimensions.height,
                  scrollSnapAlign: 'start'
                }}
              >
                <CardContent 
                  className="p-0 h-full relative"
                  style={{ padding: marginSize }}
                >
                  {/* Empty content for additional pages */}
                  <div className="h-full"></div>
                  
                  {/* Page footer */}
                  <div className="absolute bottom-2 right-0 left-0 text-center text-xs text-gray-400">
                    Page {index + 2} of {pageCount}
                  </div>
                </CardContent>
              </Card>
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
