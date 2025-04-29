
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import PaperStylePopover from '@/components/letter/PaperStylePopover';
import LinkPopover from '@/components/letter/LinkPopover';
import LetterPreview from '@/components/letter/LetterPreview';
import { LetterStyle, InlineStyle } from '@/types/letter';

interface LetterEditorProps {
  content: string;
  documentStyle: {
    font: string;
    size: string;
    color: string;
    alignment: string;
  };
  inlineStyles: InlineStyle[];
  letterStyle: LetterStyle;
  paperStylePopoverOpen: boolean;
  setPaperStylePopoverOpen: (open: boolean) => void;
  paperStyleOptions: any[];
  borderStyleOptions: any[];
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
}

const LetterEditor: React.FC<LetterEditorProps> = ({
  content,
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
  scrollToQuoteInConversation
}) => {
  return (
    <>
      {/* Styling options */}
      <div className="flex items-center gap-2 mb-4">
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
      
      {/* Letter preview */}
      {content && (
        <Card className={`${letterStyle.paperStyle} ${letterStyle.borderStyle} mb-4`}>
          <CardContent className="p-4 md:p-6">
            <LetterPreview
              content={content}
              documentStyle={documentStyle}
              inlineStyles={inlineStyles}
              scrollToQuoteInConversation={scrollToQuoteInConversation}
              timestamp={new Date().toISOString()}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default LetterEditor;
