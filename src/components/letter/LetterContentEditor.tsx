
import React, { RefObject } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Save, Clock } from 'lucide-react';
import TextFormattingToolbar from './TextFormattingToolbar';
import LinkPopover from './LinkPopover';
import PaperStylePopover from './PaperStylePopover';
import QuoteSelection from './QuoteSelection';
import LetterPreview from './LetterPreview';
import { FontOption, FontSizeOption, ColorOption, PaperStyleOption, BorderStyleOption, TextAlignment, InlineStyle, LetterStyle, ConversationMessage } from '@/types/letter';

interface LetterContentEditorProps {
  subject: string;
  setSubject: (subject: string) => void;
  content: string;
  setContent: (content: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
  documentStyle: {
    font: string;
    size: string;
    color: string;
    alignment: TextAlignment;
  };
  inlineStyles: InlineStyle[];
  letterStyle: LetterStyle;
  selectionRange: { start: number; end: number } | null;
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
  paperStyleOptions: PaperStyleOption[];
  borderStyleOptions: BorderStyleOption[];
  applyFormatting: (formatType: string, value: any) => void;
  updateLetterStyle: (type: 'paperStyle' | 'borderStyle', value: string) => void;
  handleInsertQuote: (quoteText: string, metadata: { sender: string, date: string }) => void;
  scrollToQuoteInConversation: (quoteId: string) => void;
  conversation: ConversationMessage[];
  shouldShowConversation: boolean;
  linkPopoverOpen: boolean;
  setLinkPopoverOpen: (open: boolean) => void;
  stylePopoverOpen: boolean;
  setStylePopoverOpen: (open: boolean) => void;
  paperStylePopoverOpen: boolean;
  setPaperStylePopoverOpen: (open: boolean) => void;
  linkText: string;
  setLinkText: (text: string) => void;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  insertLink: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
  formatLastSaved: () => string;
  handleAutoSave: () => void;
  handleSend: () => void;
}

const LetterContentEditor: React.FC<LetterContentEditorProps> = ({
  content,
  setContent,
  textareaRef,
  documentStyle,
  inlineStyles,
  letterStyle,
  selectionRange,
  activeTextFormat,
  fontOptions,
  fontSizeOptions,
  colorOptions,
  paperStyleOptions,
  borderStyleOptions,
  applyFormatting,
  updateLetterStyle,
  handleInsertQuote,
  scrollToQuoteInConversation,
  conversation,
  shouldShowConversation,
  linkPopoverOpen,
  setLinkPopoverOpen,
  stylePopoverOpen,
  setStylePopoverOpen,
  paperStylePopoverOpen,
  setPaperStylePopoverOpen,
  linkText,
  setLinkText,
  linkUrl,
  setLinkUrl,
  insertLink,
  isSaving,
  lastSaved,
  formatLastSaved,
  handleAutoSave,
  handleSend
}) => {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2 border-b pb-3">
        {/* Formatting toolbar */}
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
        
        <PaperStylePopover
          paperStylePopoverOpen={paperStylePopoverOpen}
          setPaperStylePopoverOpen={setPaperStylePopoverOpen}
          paperStyleOptions={paperStyleOptions}
          borderStyleOptions={borderStyleOptions}
          letterStyle={letterStyle}
          updateLetterStyle={updateLetterStyle}
        />
        
        {shouldShowConversation && (
          <QuoteSelection
            conversation={conversation}
            onQuoteSelected={handleInsertQuote}
          />
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Textarea
            ref={textareaRef}
            placeholder="Write your letter here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] font-serif"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Preview</label>
          <div className={`min-h-[200px] p-6 rounded ${letterStyle.paperStyle} ${letterStyle.borderStyle}`}>
            <LetterPreview
              content={content}
              documentStyle={documentStyle}
              inlineStyles={inlineStyles}
              scrollToQuoteInConversation={scrollToQuoteInConversation}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4 flex flex-wrap justify-between gap-2 mt-4">
        <div className="flex items-center text-sm text-muted-foreground">
          {isSaving ? (
            <span className="flex items-center">
              <Clock className="animate-pulse h-4 w-4 mr-2" />
              Saving...
            </span>
          ) : lastSaved ? (
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {formatLastSaved()}
            </span>
          ) : null}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAutoSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSend}>
            <Send className="h-4 w-4 mr-2" />
            Send Letter
          </Button>
        </div>
      </div>
    </>
  );
};

export default LetterContentEditor;
