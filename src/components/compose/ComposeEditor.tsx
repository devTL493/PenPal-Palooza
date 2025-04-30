
import React from 'react';
import ChatMessageInput from '@/components/letter/ChatMessageInput';
import useTextSelection from '@/hooks/useTextSelection';
import useLetterSave from '@/hooks/useLetterSave';
import { TextAlignment, InlineStyle, LetterStyle } from '@/types/letter';
import LetterEditor from './LetterEditor';

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
  
  // Style for the whole document
  const [documentStyle, setDocumentStyle] = React.useState({
    font: 'font-serif',
    size: 'text-lg',
    color: 'text-black',
    alignment: 'text-left' as TextAlignment,
  });
  
  // Inline styling for specific text selections
  const [inlineStyles, setInlineStyles] = React.useState<InlineStyle[]>([]);
  
  // Letter styling state
  const [letterStyle, setLetterStyle] = React.useState<LetterStyle>({
    paperStyle: 'bg-paper',
    borderStyle: 'border-none',
  });

  // Popovers state
  const [linkPopoverOpen, setLinkPopoverOpen] = React.useState(false);
  const [linkText, setLinkText] = React.useState('');
  const [linkUrl, setLinkUrl] = React.useState('');
  const [stylePopoverOpen, setStylePopoverOpen] = React.useState(false);
  const [paperStylePopoverOpen, setPaperStylePopoverOpen] = React.useState(false);
  const [activeQuoteId, setActiveQuoteId] = React.useState<string | null>(null);

  // Use custom hooks
  const { 
    selectionRange, 
    activeTextFormat, 
  } = useTextSelection({ 
    textareaRef, 
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

  const applyFormatting = (formatType: string, value: any) => {
    if (!selectionRange) return;
    
    const { start, end } = selectionRange;
    
    // Create a new style object for this selection
    const newStyle: InlineStyle = {
      start,
      end,
      ...activeTextFormat
    };
    
    // Update the specific format that was changed
    switch (formatType) {
      case 'bold':
        newStyle.isBold = !activeTextFormat.isBold;
        break;
      case 'italic':
        newStyle.isItalic = !activeTextFormat.isItalic;
        break;
      case 'underline':
        newStyle.isUnderline = !activeTextFormat.isUnderline;
        break;
      case 'font':
        newStyle.font = value;
        break;
      case 'size':
        newStyle.size = value;
        break;
      case 'color':
        newStyle.color = value;
        break;
      case 'alignment':
        newStyle.alignment = value as TextAlignment;
        // Alignment affects the whole content
        setDocumentStyle(prev => ({ ...prev, alignment: value as TextAlignment }));
        break;
    }
    
    // Add this style to the array
    setInlineStyles(prev => [...prev, newStyle]);
    
    // Close style popovers after applying
    setStylePopoverOpen(false);
    
    // Update the textarea to maintain focus
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(start, end);
    }
  };

  const insertLink = () => {
    if (!selectionRange || !linkUrl) return;

    // Simple URL validation
    let finalUrl = linkUrl;
    if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
      finalUrl = `https://${linkUrl}`;
    }

    const { start, end } = selectionRange;

    // Create new style for the link
    const newLinkStyle: InlineStyle = {
      start,
      end,
      isLink: true,
      linkUrl: finalUrl,
      color: 'text-blue-600',
      isUnderline: true,
    };

    setInlineStyles(prev => [...prev, newLinkStyle]);
    
    // Reset link fields and close popover
    setLinkText('');
    setLinkUrl('');
    setLinkPopoverOpen(false);
    
    // Return focus to textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Add the updateLetterStyle function
  const updateLetterStyle = (type: 'paperStyle' | 'borderStyle', value: string) => {
    setLetterStyle(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Function to scroll to a quote in the conversation history
  const scrollToQuoteInConversation = (quoteId: string) => {
    setActiveQuoteId(quoteId);
  };

  // Import data for style options
  const fontOptions = [
    { label: 'Serif', value: 'font-serif' },
    { label: 'Sans-serif', value: 'font-sans' },
    { label: 'Monospace', value: 'font-mono' },
  ];

  const fontSizeOptions = [
    { label: 'Small', value: 'text-sm' },
    { label: 'Normal', value: 'text-base' },
    { label: 'Large', value: 'text-lg' },
    { label: 'Extra Large', value: 'text-xl' },
  ];

  const colorOptions = [
    { label: 'Black', value: 'text-black', color: '#000000' },
    { label: 'Gray', value: 'text-gray-600', color: '#4B5563' },
    { label: 'Red', value: 'text-red-600', color: '#DC2626' },
    { label: 'Blue', value: 'text-blue-600', color: '#2563EB' },
    { label: 'Green', value: 'text-green-600', color: '#059669' },
  ];

  const paperStyleOptions = [
    { label: 'Plain White', value: 'bg-white' },
    { label: 'Cream Paper', value: 'bg-amber-50' },
    { label: 'Light Blue', value: 'bg-blue-50' },
    { label: 'Light Green', value: 'bg-green-50' },
    { label: 'Light Pink', value: 'bg-pink-50' },
    { label: 'Vintage Yellow', value: 'bg-yellow-100' },
    { label: 'Soft Gray', value: 'bg-gray-100' },
    { label: 'Parchment', value: 'bg-amber-100' },
  ];

  const borderStyleOptions = [
    { label: 'No Border', value: 'border-none' },
    { label: 'Simple Border', value: 'border-2 border-gray-200' },
    { label: 'Elegant Border', value: 'border-4 border-double border-gray-300' },
    { label: 'Bold Border', value: 'border-4 border-gray-400' },
    { label: 'Decorative Border', value: 'border-4 border-dashed border-gray-300' },
  ];

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
        insertLink={insertLink}
        scrollToQuoteInConversation={scrollToQuoteInConversation}
        stylePopoverOpen={stylePopoverOpen}
        setStylePopoverOpen={setStylePopoverOpen}
        activeTextFormat={activeTextFormat}
        fontOptions={fontOptions}
        fontSizeOptions={fontSizeOptions}
        colorOptions={colorOptions}
        applyFormatting={applyFormatting}
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
        applyFormatting={applyFormatting}
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
