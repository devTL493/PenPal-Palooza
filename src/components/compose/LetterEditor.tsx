
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import PaperStylePopover from '@/components/letter/PaperStylePopover';
import LinkPopover from '@/components/letter/LinkPopover';
import LetterPreview from '@/components/letter/LetterPreview';
import { LetterStyle, InlineStyle, TextAlignment, LetterSize } from '@/types/letter';
import { Textarea } from "@/components/ui/textarea";
import TextFormattingToolbar from '@/components/letter/TextFormattingToolbar';
import { FontOption, FontSizeOption, ColorOption, PaperStyleOption, BorderStyleOption } from '@/types/letter';
import { PaperSizeOption } from '@/hooks/usePaperStyle';

interface LetterEditorProps {
  content: string;
  setContent: (content: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  documentStyle: {
    font: string;
    size: string;
    color: string;
    alignment: TextAlignment;
  };
  inlineStyles: InlineStyle[];
  letterStyle: LetterStyle;
  paperStylePopoverOpen: boolean;
  setPaperStylePopoverOpen: (open: boolean) => void;
  paperStyleOptions: PaperStyleOption[];
  borderStyleOptions: BorderStyleOption[];
  updateLetterStyle: (type: 'paperStyle' | 'borderStyle', value: string) => void;
  linkPopoverOpen: boolean;
  setLinkPopoverOpen: (open: boolean) => void;
  selectionRange: { start: number; end: number } | null;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  linkText: string;
  setLinkText: (text: string) => void;
  insertLink: () => void;
  scrollToQuoteInConversation: (quoteId: string) => void;
  stylePopoverOpen: boolean;
  setStylePopoverOpen: (open: boolean) => void;
  activeTextFormat: {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    font: string;
    size: string;
    color: string;
    alignment: TextAlignment;
  };
  fontOptions: FontOption[];
  fontSizeOptions: FontSizeOption[];
  colorOptions: ColorOption[];
  applyFormatting: (formatType: string, value: any) => void;
  // Paper size related props
  paperSizeProps?: {
    paperSize: LetterSize;
    setPaperSize: (size: LetterSize) => void;
    paperSizeOptions: PaperSizeOption[];
    customWidth: string;
    setCustomWidth: (width: string) => void;
    customHeight: string;
    setCustomHeight: (height: string) => void;
    isCustomSize: boolean;
  };
  paperDimensions?: { width: string; height: string };
}

const LetterEditor: React.FC<LetterEditorProps> = ({
  content,
  setContent,
  textareaRef,
  documentStyle,
  inlineStyles,
  letterStyle,
  paperStylePopoverOpen,
  setPaperStylePopoverOpen,
  paperStyleOptions,
  borderStyleOptions,
  updateLetterStyle,
  linkPopoverOpen,
  setLinkPopoverOpen,
  selectionRange,
  linkUrl,
  setLinkUrl,
  linkText,
  setLinkText,
  insertLink,
  scrollToQuoteInConversation,
  stylePopoverOpen,
  setStylePopoverOpen,
  activeTextFormat,
  fontOptions,
  fontSizeOptions,
  colorOptions,
  applyFormatting,
  paperSizeProps,
  paperDimensions
}) => {
  // Set default paper dimensions if not provided
  const dimensions = paperDimensions || { width: '210mm', height: '297mm' };
  
  // Calculate a scaled version for display purposes (80% of actual size for better fit)
  const scaledWidth = `calc(${dimensions.width} * 0.8)`;
  const scaledHeight = `calc(${dimensions.height} * 0.8)`;
  
  // For very small screens, further reduce the scale
  const isMobile = window.innerWidth < 768;
  const mobileScaleFactor = isMobile ? 0.5 : 1;
  
  return (
    <>
      {/* Text formatting and styling options */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <TextFormattingToolbar
          selectionRange={selectionRange}
          activeTextFormat={activeTextFormat}
          fontOptions={fontOptions}
          fontSizeOptions={fontSizeOptions}
          colorOptions={colorOptions}
          stylePopoverOpen={stylePopoverOpen}
          setStylePopoverOpen={setStylePopoverOpen}
          applyFormatting={applyFormatting}
        />
        
        <PaperStylePopover
          paperStylePopoverOpen={paperStylePopoverOpen}
          setPaperStylePopoverOpen={setPaperStylePopoverOpen}
          paperStyleOptions={paperStyleOptions}
          borderStyleOptions={borderStyleOptions}
          letterStyle={letterStyle}
          updateLetterStyle={updateLetterStyle}
          paperSizeProps={paperSizeProps}
        />
        
        <LinkPopover
          linkPopoverOpen={linkPopoverOpen}
          setLinkPopoverOpen={setLinkPopoverOpen}
          selectionRange={selectionRange}
          linkUrl={linkUrl}
          setLinkUrl={setLinkUrl}
          linkText={linkText}
          setLinkText={setLinkText}
          onInsertLink={insertLink}
        />
      </div>
      
      {/* Integrated letter editor with live preview */}
      {content !== undefined && (
        <div className="flex justify-center mb-4">
          <Card 
            className={`${letterStyle.paperStyle} ${letterStyle.borderStyle} relative overflow-hidden`}
            style={{ 
              width: `calc(${scaledWidth} * ${mobileScaleFactor})`,
              height: `calc(${scaledHeight} * ${mobileScaleFactor})`
            }}
          >
            <CardContent className="p-4 md:p-6 relative h-full overflow-hidden">
              {/* The preview and textarea are stacked with the textarea being transparent */}
              {/* LetterPreview visible layer */}
              <div className="absolute inset-0 p-4 md:p-6 z-10 pointer-events-none">
                <LetterPreview
                  content={content}
                  documentStyle={documentStyle}
                  inlineStyles={inlineStyles}
                  scrollToQuoteInConversation={scrollToQuoteInConversation}
                  timestamp={new Date().toISOString()}
                  isPreview={false} /* Don't show duplicate text */
                />
              </div>
              
              {/* Textarea input layer that's invisible but functional */}
              <Textarea
                ref={textareaRef}
                placeholder="Write your letter here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-full resize-none font-serif relative z-20 opacity-100 bg-transparent"
                style={{ 
                  caretColor: documentStyle.color === 'text-white' ? '#FFFFFF' : '#000000',
                  color: 'transparent' 
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default LetterEditor;
