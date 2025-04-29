
import React, { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import ChatMessageInput from '@/components/letter/ChatMessageInput';
import LetterPreview from '@/components/letter/LetterPreview';
import LetterContent from '@/components/letter/LetterContent';
import PaperStylePopover from '@/components/letter/PaperStylePopover';
import LinkPopover from '@/components/letter/LinkPopover';
import useTextSelection from '@/hooks/useTextSelection';
import useLetterSave from '@/hooks/useLetterSave';
import { ComposeViewMode } from '@/components/letter/ComposeViewOption';
import { InlineStyle, LetterStyle, TextAlignment, ConversationMessage } from '@/types/letter';
import { fontOptions, fontSizeOptions, colorOptions, paperStyleOptions, borderStyleOptions, samplePenPals } from '@/data/sampleData';

interface ComposeMainContentProps {
  recipient: string;
  subject: string;
  setSubject: (subject: string) => void;
  content: string;
  setContent: (content: string) => void;
  conversation: ConversationMessage[];
  isInConversationContext: boolean;
  handleSend: () => void;
  viewMode: ComposeViewMode;
}

const ComposeMainContent: React.FC<ComposeMainContentProps> = ({
  recipient,
  subject,
  setSubject,
  content,
  setContent,
  conversation,
  isInConversationContext,
  handleSend,
  viewMode
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Style for the whole document
  const [documentStyle, setDocumentStyle] = useState({
    font: 'font-serif',
    size: 'text-lg',
    color: 'text-black',
    alignment: 'text-left' as TextAlignment,
  });
  
  // Inline styling for specific text selections
  const [inlineStyles, setInlineStyles] = useState<InlineStyle[]>([]);
  
  // Letter styling state
  const [letterStyle, setLetterStyle] = useState<LetterStyle>({
    paperStyle: 'bg-paper',
    borderStyle: 'border-none',
  });

  // Popovers state
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [stylePopoverOpen, setStylePopoverOpen] = useState(false);
  const [paperStylePopoverOpen, setPaperStylePopoverOpen] = useState(false);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);

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

  // Handle quote insertions with metadata
  const handleInsertQuote = (quoteText: string, metadata: { sender: string, date: string }) => {
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart;
      const textBefore = content.substring(0, cursorPos);
      const textAfter = content.substring(cursorPos);
      
      // Format the quote with special styling and metadata
      const formattedQuote = `\n\n<blockquote data-sender="${metadata.sender}" data-date="${metadata.date}">\n${quoteText}\n</blockquote>\n\n`;
      
      // Insert quote at cursor position
      const newContent = textBefore + formattedQuote + textAfter;
      setContent(newContent);
      
      // Adjust inline styles after the insertion point
      const quoteLength = formattedQuote.length;
      setInlineStyles(prev => 
        prev.map(style => {
          if (style.start >= cursorPos) {
            return {
              ...style,
              start: style.start + quoteLength,
              end: style.end + quoteLength
            };
          }
          return style;
        })
      );
      
      // Focus and move cursor after the inserted quote
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = cursorPos + quoteLength;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };

  // Function to scroll to a quote in the conversation history
  const scrollToQuoteInConversation = (quoteId: string) => {
    // First, ensure the conversation is visible
    if (viewMode === 'new-tab') {
      return;
    }
    
    // Set the active quote and ensure conversation is expanded
    setActiveQuoteId(quoteId);
  };

  // Add the updateLetterStyle function
  const updateLetterStyle = (type: 'paperStyle' | 'borderStyle', value: string) => {
    setLetterStyle(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  return (
    <div className="p-4 flex flex-col h-full overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Compose Letter</h2>
        {!isInConversationContext && (
          <div className="space-y-4 mb-4">
            <div>
              <Select value={recipient}>
                <SelectTrigger id="recipient">
                  <SelectValue placeholder="Select recipient..." />
                </SelectTrigger>
                <SelectContent>
                  {samplePenPals.map((penpal) => (
                    <SelectItem key={penpal.id} value={penpal.id}>
                      {penpal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Input
                id="subject"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="font-medium"
              />
            </div>
          </div>
        )}
      </div>
      
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
      
      {/* Message input */}
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
      />
    </div>
  );
};

export default ComposeMainContent;
