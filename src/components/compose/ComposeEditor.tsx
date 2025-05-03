
import React from 'react';
import ChatMessageInput from '@/components/letter/ChatMessageInput';
import useTextSelection from '@/hooks/useTextSelection';
import useLetterSave from '@/hooks/useLetterSave';
import { useLetterFormatting } from '@/hooks/useLetterFormatting';
import LetterEditor from './LetterEditor';
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
    selectionRange, 
    activeTextFormat, 
  } = useTextSelection({ 
    editorRef, 
    content, 
    inlineStyles, 
    documentStyle 
  });

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
    if (textareaRef.current && selectionRange) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(selectionRange.start, selectionRange.end);
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
      <LetterEditor 
        content={content}
        setContent={setContent}
        textareaRef={textareaRef}
        documentStyle={documentStyle}
        inlineStyles={inlineStyles}
        letterStyle={letterStyle}
        paperStylePopoverOpen={paperStylePopoverOpen}
        setPaperStylePopoverOpen={setPaperStylePopoverOpen}
        paperStyleOptions={paperStyleOptions}
        borderStyleOptions={borderStyleOptions}
        updateLetterStyle={updateLetterStyle}
        linkPopoverOpen={linkPopoverOpen}
        setLinkPopoverOpen={setLinkPopoverOpen}
        selectionRange={selectionRange}
        linkUrl={linkUrl}
        setLinkUrl={setLinkUrl}
        linkText={linkText}
        setLinkText={setLinkText}
        insertLink={handleInsertLink}
        scrollToQuoteInConversation={scrollToQuoteInConversation}
        stylePopoverOpen={stylePopoverOpen}
        setStylePopoverOpen={setStylePopoverOpen}
        activeTextFormat={activeTextFormat}
        fontOptions={fontOptions}
        fontSizeOptions={fontSizeOptions}
        colorOptions={colorOptions}
        applyFormatting={handleApplyFormatting}
      />
      
      {/* Message input actions */}
      <ChatMessageInput 
        content={content}
        setContent={setContent}
        textareaRef={textareaRef}
        selectionRange={selectionRange}
        activeTextFormat={activeTextFormat}
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
