
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import PaperStylePopover from '@/components/letter/PaperStylePopover';
import LinkPopover from '@/components/letter/LinkPopover';
import LetterPreview from '@/components/letter/LetterPreview';
import { LetterStyle, InlineStyle, TextAlignment } from '@/types/letter';
import { Textarea } from "@/components/ui/textarea";
import TextFormattingToolbar from '@/components/letter/TextFormattingToolbar';
import { FontOption, FontSizeOption, ColorOption, PaperStyleOption, BorderStyleOption } from '@/types/letter';

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
  applyFormatting
}) => {
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
        <Card className={`${letterStyle.paperStyle} ${letterStyle.borderStyle} mb-4 min-h-[60vh] relative`}>
          <CardContent className="p-4 md:p-6 relative">
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
              className="min-h-[60vh] resize-none font-serif relative z-20 opacity-100 bg-transparent"
              style={{ 
                caretColor: documentStyle.color === 'text-white' ? '#FFFFFF' : '#000000',
                color: 'transparent' 
              }}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default LetterEditor;
