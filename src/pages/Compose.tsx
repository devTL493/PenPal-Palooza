
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Navigation from '@/components/Navigation';
import { Send, Paperclip, Save, Clock } from 'lucide-react';
import ComposeViewOption, { ComposeViewMode } from '@/components/letter/ComposeViewOption';
import TextFormatToolbar from '@/components/letter/TextFormatToolbar';
import PaperStyleSelector from '@/components/letter/PaperStyleSelector';
import LetterPreview from '@/components/letter/LetterPreview';
import ConversationHistory from '@/components/letter/ConversationHistory';
import QuoteSelection from '@/components/letter/QuoteSelection';
import { 
  TextAlignment, 
  InlineStyle, 
  LetterStyle, 
  DocumentStyle 
} from '@/types/letter';

// Sample pen pals for the demo
const samplePenPals = [
  { id: '1', name: 'Emily Chen' },
  { id: '2', name: 'Marcus Johnson' },
  { id: '3', name: 'Sophia Williams' },
  { id: '4', name: 'David Kim' },
];

// Conversation sample data for demo
const sampleConversation = [
  {
    id: 'c1-1',
    sender: {
      name: 'You',
      isYou: true,
    },
    content: "Dear Emily,\n\nI hope this letter finds you well. I've been thinking about taking a trip abroad this year, and I'd love to hear your recommendations...",
    date: 'May 1, 2023',
  },
  {
    id: 'c1-2',
    sender: {
      name: 'Emily Chen',
    },
    content: "Dear Friend,\n\nI was so happy to receive your letter! Japan is one of my favorite places in the world, and I think you would absolutely love it...",
    date: 'May 5, 2023',
  }
];

const Compose = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isFormatToolbarOpen, setIsFormatToolbarOpen] = useState(false);
  const [selectionRange, setSelectionRange] = useState<{start: number, end: number} | null>(null);
  
  // View mode state
  const [viewMode, setViewMode] = useState<ComposeViewMode>('overlay');
  const [conversation, setConversation] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  // Style for the whole document (default styling)
  const [documentStyle, setDocumentStyle] = useState<DocumentStyle>({
    font: 'font-serif',
    size: 'text-lg',
    color: 'text-black',
    alignment: 'text-left',
  });
  
  // Inline styling for specific text selections
  const [inlineStyles, setInlineStyles] = useState<InlineStyle[]>([]);
  
  // Letter styling state
  const [letterStyle, setLetterStyle] = useState<LetterStyle>({
    paperStyle: 'bg-paper',
    borderStyle: 'border-none',
  });

  // Selected text formatting state
  const [activeTextFormat, setActiveTextFormat] = useState({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    font: documentStyle.font,
    size: documentStyle.size,
    color: documentStyle.color,
    alignment: documentStyle.alignment,
  });

  // Link insertion
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [stylePopoverOpen, setStylePopoverOpen] = useState(false);
  const [paperStylePopoverOpen, setPaperStylePopoverOpen] = useState(false);

  // Check if we should show the conversation (only in overlay or side-by-side modes)
  const shouldShowConversation = viewMode !== 'new-tab' && conversation.length > 0;

  // Process query parameters for pre-filled data
  useEffect(() => {
    const recipientId = searchParams.get('recipient');
    if (recipientId) {
      setRecipient(recipientId);
    }

    const conversationParam = searchParams.get('conversation');
    if (conversationParam) {
      setConversationId(conversationParam);
      // In a real app, you'd fetch the conversation with this ID
      // For the demo, we'll use the sample conversation
      setConversation(sampleConversation);
    }
    
    // Handle new tab mode from URL parameter
    const mode = searchParams.get('mode');
    if (mode === 'new-tab') {
      setViewMode('new-tab');
    }
  }, [searchParams]);
  
  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content.trim() || subject.trim() || recipient) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [content, subject, recipient, inlineStyles, letterStyle]);

  // Handle text selection
  useEffect(() => {
    const handleSelectionChange = () => {
      if (!textareaRef.current) return;

      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      if (start !== end) {
        setSelectionRange({ start, end });
        setIsFormatToolbarOpen(true);
        
        // Check if selection has existing styles and update active format buttons
        updateActiveFormatsForSelection(start, end);
      } else {
        setSelectionRange(null);
        setIsFormatToolbarOpen(false);
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('mouseup', handleSelectionChange);
      textarea.addEventListener('keyup', handleSelectionChange);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener('mouseup', handleSelectionChange);
        textarea.removeEventListener('keyup', handleSelectionChange);
      }
    };
  }, [inlineStyles, content]);

  const updateActiveFormatsForSelection = (start: number, end: number) => {
    // Find styles that affect this selection
    const overlappingStyles = inlineStyles.filter(style => 
      (style.start <= start && style.end > start) || 
      (style.start < end && style.end >= end) ||
      (start <= style.start && end >= style.end)
    );

    if (overlappingStyles.length > 0) {
      // Get the last applied style (priority to the most recent)
      const latestStyle = overlappingStyles[overlappingStyles.length - 1];
      
      setActiveTextFormat({
        isBold: latestStyle.isBold || false,
        isItalic: latestStyle.isItalic || false,
        isUnderline: latestStyle.isUnderline || false,
        font: latestStyle.font || documentStyle.font,
        size: latestStyle.size || documentStyle.size,
        color: latestStyle.color || documentStyle.color,
        alignment: latestStyle.alignment || documentStyle.alignment,
      });
    } else {
      // Reset to document default if no styles apply
      setActiveTextFormat({
        isBold: false,
        isItalic: false,
        isUnderline: false,
        font: documentStyle.font,
        size: documentStyle.size,
        color: documentStyle.color,
        alignment: documentStyle.alignment,
      });
    }
  };

  const handleAutoSave = () => {
    setIsSaving(true);
    
    // Simulate saving to a database
    setTimeout(() => {
      setLastSaved(new Date());
      setIsSaving(false);
    }, 800);
  };

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
        setActiveTextFormat(prev => ({ ...prev, isBold: !prev.isBold }));
        break;
      case 'italic':
        newStyle.isItalic = !activeTextFormat.isItalic;
        setActiveTextFormat(prev => ({ ...prev, isItalic: !prev.isItalic }));
        break;
      case 'underline':
        newStyle.isUnderline = !activeTextFormat.isUnderline;
        setActiveTextFormat(prev => ({ ...prev, isUnderline: !prev.isUnderline }));
        break;
      case 'font':
        newStyle.font = value;
        setActiveTextFormat(prev => ({ ...prev, font: value }));
        break;
      case 'size':
        newStyle.size = value;
        setActiveTextFormat(prev => ({ ...prev, size: value }));
        break;
      case 'color':
        newStyle.color = value;
        setActiveTextFormat(prev => ({ ...prev, color: value }));
        break;
      case 'alignment':
        newStyle.alignment = value as TextAlignment;
        setActiveTextFormat(prev => ({ ...prev, alignment: value as TextAlignment }));
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

  const handleViewModeChange = (mode: ComposeViewMode) => {
    setViewMode(mode);
  };

  const handleSend = () => {
    if (!recipient) {
      toast({
        title: "Recipient required",
        description: "Please select a recipient for your letter.",
        variant: "destructive",
      });
      return;
    }

    if (!subject.trim()) {
      toast({
        title: "Subject required",
        description: "Please add a subject to your letter.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Letter content required",
        description: "Your letter needs some content before sending.",
        variant: "destructive",
      });
      return;
    }

    // Create the letter object with styling information
    const letterData = {
      recipient,
      subject,
      content,
      documentStyle,
      inlineStyles,
      letterStyle,
      sentAt: new Date(),
    };

    // Simulate sending the letter
    console.log("Sending letter with styles:", letterData);
    
    toast({
      title: "Letter sent",
      description: "Your letter has been sent successfully with your chosen styles.",
    });

    // Reset form after sending
    setRecipient('');
    setSubject('');
    setContent('');
    setInlineStyles([]);
    setLastSaved(null);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    return `Last saved at ${lastSaved.toLocaleTimeString()}`;
  };

  const insertLink = () => {
    if (!selectionRange || !linkText || !linkUrl) {
      toast({
        title: "Both link text and URL are required",
        description: "Please select text and enter both link text and URL.",
        variant: "destructive",
      });
      return;
    }

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

  // Calculate letter card classes based on styling
  const letterCardClasses = `${letterStyle.paperStyle} ${letterStyle.borderStyle}`;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-serif font-medium">Compose Letter</h1>
            
            {conversation.length > 0 && (
              <ComposeViewOption
                currentMode={viewMode}
                onModeChange={handleViewModeChange}
              />
            )}
          </div>
          
          <div className={`${viewMode === 'side-by-side' && shouldShowConversation ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
            {/* Conversation Column (only in side-by-side mode) */}
            {viewMode === 'side-by-side' && shouldShowConversation && (
              <ConversationHistory conversation={conversation} />
            )}
            
            {/* Compose Column */}
            <div className="flex-1">
              <Card className={letterCardClasses}>
                <CardHeader className="border-b border-border">
                  <div className="space-y-4">
                    <div>
                      <Select value={recipient} onValueChange={setRecipient}>
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
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="mb-4 flex flex-wrap items-center gap-2 border-b pb-3">
                    {/* Formatting toolbar */}
                    <TextFormatToolbar 
                      selectionRange={selectionRange}
                      activeTextFormat={activeTextFormat}
                      applyFormatting={applyFormatting}
                      insertLink={insertLink}
                      linkText={linkText}
                      setLinkText={setLinkText}
                      linkUrl={linkUrl}
                      setLinkUrl={setLinkUrl}
                      linkPopoverOpen={linkPopoverOpen}
                      setLinkPopoverOpen={setLinkPopoverOpen}
                      stylePopoverOpen={stylePopoverOpen}
                      setStylePopoverOpen={setStylePopoverOpen}
                    />
                    
                    {/* Paper Style */}
                    <PaperStyleSelector
                      letterStyle={letterStyle}
                      setLetterStyle={setLetterStyle}
                      paperStylePopoverOpen={paperStylePopoverOpen}
                      setPaperStylePopoverOpen={setPaperStylePopoverOpen}
                    />
                    
                    {/* Quote selection (only in side-by-side or overlay modes) */}
                    {shouldShowConversation && (
                      <QuoteSelection 
                        conversation={conversation}
                        onQuoteSelected={handleInsertQuote}
                      />
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="min-h-[400px]">
                      <Textarea
                        ref={textareaRef}
                        placeholder="Write your letter here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[400px] w-full resize-none font-serif"
                      />
                    </div>
                    
                    <div className="min-h-[400px] border rounded-md p-4 overflow-y-auto">
                      <LetterPreview 
                        content={content} 
                        documentStyle={documentStyle}
                        inlineStyles={inlineStyles}
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleAutoSave}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    
                    <span className="text-xs text-muted-foreground">
                      {isSaving ? 'Saving...' : formatLastSaved()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-1" />
                      Attach
                    </Button>
                    
                    <Button onClick={handleSend}>
                      <Send className="h-4 w-4 mr-1" />
                      Send Letter
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              
              {/* Overlay mode conversation display */}
              {viewMode === 'overlay' && shouldShowConversation && (
                <div className="mt-6">
                  <h2 className="text-lg font-medium font-serif mb-2">Conversation History</h2>
                  <ConversationHistory conversation={conversation} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Compose;
