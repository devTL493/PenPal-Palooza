
import React from 'react';
import ChatMessageInput from '@/components/letter/ChatMessageInput';
import useLetterSave from '@/hooks/useLetterSave';
import { useLetterFormatting } from '@/hooks/useLetterFormatting';
import SlateEditor from './SlateEditor';
import { fontOptions, fontSizeOptions, colorOptions, paperStyleOptions, borderStyleOptions } from '@/data/editorOptions';

interface ComposeEditorProps {
  content: string;
  setContent: (content: string) => void;
  subject: string;
  recipient: string;
  handleSend: () => void;
}

const ComposeEditor: React.FC<ComposeEditorProps> = ({
  content,
  setContent,
  subject,
  recipient,
  handleSend
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [activeQuoteId, setActiveQuoteId] = React.useState<string | null>(null);
  
  // Use custom hooks
  const letterFormatting = useLetterFormatting();
  
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
    insertLink
  } = letterFormatting;

  const { 
    isSaving, 
    lastSaved, 
    handleAutoSave, 
    formatLastSaved 
  } = useLetterSave({ 
    content, 
    subject, 
    recipient, 
    inlineStyles, 
    letterStyle 
  });

  // Function to apply formatting with correct parameters
  const handleApplyFormatting = (formatType: string, value: any) => {
    applyFormatting(formatType, value);
    
    // Close style popovers after applying
    setStylePopoverOpen(false);
    
    // Update the textarea to maintain focus
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Function to handle inserting links
  const handleInsertLink = () => {
    insertLink(linkUrl);
    
    // Return focus to textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Function to scroll to a quote in the conversation history
  const scrollToQuoteInConversation = (quoteId: string) => {
    setActiveQuoteId(quoteId);
  };

  return (
    <>
      <SlateEditor 
        content={content}
        setContent={setContent}
        documentStyle={documentStyle}
        letterStyle={letterStyle}
        updateLetterStyle={updateLetterStyle}
        paperStyleOptions={paperStyleOptions}
        borderStyleOptions={borderStyleOptions}
        fontOptions={fontOptions}
        fontSizeOptions={fontSizeOptions}
        colorOptions={colorOptions}
        applyFormatting={handleApplyFormatting}
        insertLink={handleInsertLink}
        handleAutoSave={handleAutoSave}
      />
      
      {/* Message input actions */}
      <ChatMessageInput 
        content={content}
        setContent={setContent}
        textareaRef={textareaRef}
        selectionRange={null}
        activeTextFormat={{
          isBold: false,
          isItalic: false,
          isUnderline: false,
          font: documentStyle.font,
          size: documentStyle.size,
          color: documentStyle.color,
          alignment: documentStyle.alignment
        }}
        fontOptions={fontOptions}
        fontSizeOptions={fontSizeOptions}
        colorOptions={colorOptions}
        stylePopoverOpen={stylePopoverOpen}
        setStylePopoverOpen={setStylePopoverOpen}
        applyFormatting={handleApplyFormatting}
        handleSend={handleSend}
        isSaving={isSaving}
        lastSaved={lastSaved}
        handleAutoSave={handleAutoSave}
        formatLastSaved={formatLastSaved}
      />
    </>
  );
};

export default ComposeEditor;
