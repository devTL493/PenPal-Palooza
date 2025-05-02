
import React, { useState, useRef, useEffect } from 'react';
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
import { Grip } from 'lucide-react';

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
  const dragControls = useDragControls();
  
  // Toolbar positioning state
  const [isToolbarDetached, setIsToolbarDetached] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  
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
    { value: 'font-mono', label: 'Typewriter' },
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
  
  return (
    <div className="flex flex-col items-center" onMouseMove={handleMouseMove}>
      {/* Toolbar (appears on hover/selection) */}
      <AnimatePresence>
        {isToolbarVisible && (
          <motion.div 
            ref={toolbarRef}
            className={`${!isToolbarDetached ? 'sticky top-24' : ''} z-50 mb-4 rounded-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border border-gray-100 dark:border-gray-800 py-2 px-4`}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Paper */}
      <Card 
        ref={paperRef}
        className={`${letterStyle.paperStyle} ${letterStyle.borderStyle} texture shadow-paper overflow-hidden transition-all duration-300 relative`}
        style={{ 
          width: dimensions.width,
          height: dimensions.height,
          transformOrigin: 'top center',
          cursor: 'text'
        }}
        onClick={handlePaperClick}
      >
        <CardContent 
          className="p-0 h-full relative"
          style={{ 
            padding: marginSize 
          }}
        >
          {/* Text overlay for styling */}
          <div className="absolute inset-0 z-10 pointer-events-none p-4" style={{ padding: marginSize }}>
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
            className={`w-full h-full resize-none bg-transparent z-20 relative ${documentStyle.font} leading-relaxed focus:outline-none`}
            style={{ 
              caretColor: documentStyle.color === 'text-white' ? '#FFFFFF' : '#000000',
              color: 'transparent',
              lineHeight: '1.8',
            }}
            placeholder="Start writing your letter..."
            onClick={() => setIsToolbarVisible(true)}
          />
        </CardContent>
      </Card>
      
      {/* Keyboard shortcuts info */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Press <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">ESC</kbd> to toggle toolbar • Hover over paper to show toolbar</p>
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
