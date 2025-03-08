
import React, { useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import Navigation from '@/components/Navigation';
import { ArrowLeft } from 'lucide-react';
import ComposeViewOption, { ComposeViewMode } from '@/components/letter/ComposeViewOption';
import ConversationHistory from '@/components/letter/ConversationHistory';
import LetterContentEditor from '@/components/letter/LetterContentEditor';
import useTextSelection from '@/hooks/useTextSelection';
import useLetterSave from '@/hooks/useLetterSave';
import { InlineStyle, LetterStyle, TextAlignment, ConversationMessage } from '@/types/letter';

// Sample pen pals for the demo
const samplePenPals = [
  { id: '1', name: 'Emily Chen' },
  { id: '2', name: 'Marcus Johnson' },
  { id: '3', name: 'Sophia Williams' },
  { id: '4', name: 'David Kim' },
];

// Font options
const fontOptions = [
  { value: 'font-serif', label: 'Serif' },
  { value: 'font-sans', label: 'Sans Serif' },
  { value: 'font-mono', label: 'Monospace' },
  { value: 'font-serif italic', label: 'Serif Italic' },
  { value: 'font-sans italic', label: 'Sans Serif Italic' },
];

// Font size options
const fontSizeOptions = [
  { value: 'text-sm', label: 'Small' },
  { value: 'text-base', label: 'Medium' },
  { value: 'text-lg', label: 'Large' },
  { value: 'text-xl', label: 'Extra Large' },
  { value: 'text-2xl', label: 'Double Extra Large' },
];

// Text color options
const colorOptions = [
  { value: 'text-black', label: 'Black', color: '#000000' },
  { value: 'text-blue-600', label: 'Blue', color: '#2563eb' },
  { value: 'text-green-600', label: 'Green', color: '#059669' },
  { value: 'text-red-600', label: 'Red', color: '#dc2626' },
  { value: 'text-purple-600', label: 'Purple', color: '#9333ea' },
  { value: 'text-amber-600', label: 'Amber', color: '#d97706' },
  { value: 'text-pink-600', label: 'Pink', color: '#db2777' },
  { value: 'text-gray-600', label: 'Gray', color: '#4b5563' },
];

// Paper style options
const paperStyleOptions = [
  { value: 'bg-paper', label: 'Classic Cream', description: 'Traditional cream-colored paper' },
  { value: 'bg-white', label: 'Bright White', description: 'Clean, bright white paper' },
  { value: 'bg-blue-50', label: 'Cool Blue', description: 'Subtle blue-tinted paper' },
  { value: 'bg-amber-50', label: 'Warm Amber', description: 'Warm, amber-tinted paper' },
  { value: 'bg-green-50', label: 'Sage Green', description: 'Soft sage green paper' },
  { value: 'bg-pink-50', label: 'Blush Pink', description: 'Light blush pink paper' },
  { value: 'bg-purple-50', label: 'Lavender', description: 'Gentle lavender-tinted paper' },
  { value: 'bg-gradient-to-r from-amber-50 to-yellow-50', label: 'Sunset Gradient', description: 'Warm gradient effect' },
  { value: 'bg-gradient-to-r from-blue-50 to-purple-50', label: 'Ocean Gradient', description: 'Cool blue to purple gradient' },
];

// Border style options
const borderStyleOptions = [
  { value: 'border-none', label: 'None', description: 'No border' },
  { value: 'border border-gray-200', label: 'Simple', description: 'Simple thin border' },
  { value: 'border-2 border-gray-300', label: 'Bold', description: 'Bold border' },
  { value: 'border border-dashed border-gray-300', label: 'Dashed', description: 'Dashed border style' },
  { value: 'border border-dotted border-gray-300', label: 'Dotted', description: 'Dotted border style' },
  { value: 'border-2 border-double border-gray-300', label: 'Double', description: 'Double-line border' },
  { value: 'border-2 border-gray-300 rounded-lg', label: 'Rounded', description: 'Rounded corners with border' },
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // View mode state - changed default to side-by-side
  const [viewMode, setViewMode] = useState<ComposeViewMode>('side-by-side');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isInConversationContext, setIsInConversationContext] = useState(false);
  
  // Style for the whole document (default styling)
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

  // Link insertion
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [stylePopoverOpen, setStylePopoverOpen] = useState(false);
  const [paperStylePopoverOpen, setPaperStylePopoverOpen] = useState(false);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);

  // Used for styling the letter card
  const letterCardClasses = `overflow-hidden ${letterStyle.paperStyle} ${letterStyle.borderStyle}`;

  // Check if we should show the conversation (only in overlay or side-by-side modes)
  const shouldShowConversation = viewMode !== 'new-tab' && conversation.length > 0;

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

  // Process query parameters for pre-filled data
  React.useEffect(() => {
    const recipientId = searchParams.get('recipient');
    if (recipientId) {
      setRecipient(recipientId);
      
      // Get recipient name if provided
      const name = searchParams.get('name');
      if (name) {
        setRecipientName(name);
      } else {
        // Find name from sample penpal data
        const penpal = samplePenPals.find(p => p.id === recipientId);
        if (penpal) {
          setRecipientName(penpal.name);
        }
      }
    }

    const conversationParam = searchParams.get('conversation');
    if (conversationParam === 'true') {
      setIsInConversationContext(true);
      // In a real app, you'd fetch the conversation with this ID
      // For the demo, we'll use the sample conversation
      setConversation(sampleConversation);
    }
    
    // Handle new tab mode from URL parameter
    const mode = searchParams.get('mode');
    if (mode === 'new-tab') {
      setViewMode('new-tab');
    }

    // Handle draft parameter
    const draftId = searchParams.get('draft');
    if (draftId) {
      // In a real app, you would fetch the draft from your database
      // For demo purposes, we'll use sample data
      setContent("Dear Emily, I wanted to thank you for your detailed description of Japan...");
      setSubject("Reply to Emily about Japan");
    }
  }, [searchParams]);

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

  const handleSend = () => {
    if (!isInConversationContext && !recipient) {
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
      recipient: recipient || conversationId,
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

    // Navigate back to the conversation or dashboard
    navigate(conversationId ? `/conversation/${conversationId}` : '/dashboard');
  };

  const insertLink = () => {
    if (!selectionRange || !linkUrl) {
      toast({
        title: "URL is required",
        description: "Please select text and enter a URL.",
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

  // Function to scroll to a quote in the conversation history
  const scrollToQuoteInConversation = (quoteId: string) => {
    // First, ensure the conversation is visible
    if (viewMode === 'new-tab') {
      // In new-tab mode, we might need to go back to the conversation view
      toast({
        title: "Cannot scroll to quote",
        description: "Quotes can only be navigated in overlay or side-by-side view modes.",
      });
      return;
    }
    
    // Set the active quote and ensure conversation is expanded
    setActiveQuoteId(quoteId);
  };

  // Function to handle view mode changes
  const handleViewModeChange = (mode: ComposeViewMode) => {
    setViewMode(mode);
    
    // If switching to new-tab mode, open in a new window/tab
    if (mode === 'new-tab') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', 'new-tab');
      window.open(url.toString(), '_blank');
    }
  };

  // Function to update letter styling
  const updateLetterStyle = (type: 'paperStyle' | 'borderStyle', value: string) => {
    setLetterStyle(prev => ({ ...prev, [type]: value }));
    setPaperStylePopoverOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className={`w-full px-4 pt-24 pb-16 ${viewMode === 'overlay' && shouldShowConversation ? 'relative' : ''}`}>
        <div className="w-full mx-auto">
          <div className="flex justify-between items-center mb-6 max-w-screen-2xl mx-auto">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-serif font-medium">
                {isInConversationContext 
                  ? `Reply to ${recipientName || "Conversation"}` 
                  : "Compose Letter"}
              </h1>
            </div>
            
            {conversation.length > 0 && (
              <ComposeViewOption
                currentMode={viewMode}
                onModeChange={handleViewModeChange}
                recipientId={recipient}
              />
            )}
          </div>
          
          <div className={`max-w-screen-2xl mx-auto ${viewMode === 'side-by-side' && shouldShowConversation ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : ''}`}>
            {/* Compose Column - Now comes first in side-by-side mode */}
            <div className={`flex-1 ${viewMode === 'overlay' && shouldShowConversation ? 'relative z-10' : ''} ${viewMode === 'side-by-side' && shouldShowConversation ? 'order-2 md:order-1' : ''}`}>
              <Card className={letterCardClasses}>
                <CardHeader className="border-b border-border">
                  <div className="space-y-4">
                    {!isInConversationContext && (
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
                    )}
                    
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
                  <LetterContentEditor 
                    subject={subject}
                    setSubject={setSubject}
                    content={content}
                    setContent={setContent}
                    textareaRef={textareaRef}
                    documentStyle={documentStyle}
                    inlineStyles={inlineStyles}
                    letterStyle={letterStyle}
                    selectionRange={selectionRange}
                    activeTextFormat={activeTextFormat}
                    fontOptions={fontOptions}
                    fontSizeOptions={fontSizeOptions}
                    colorOptions={colorOptions}
                    paperStyleOptions={paperStyleOptions}
                    borderStyleOptions={borderStyleOptions}
                    applyFormatting={applyFormatting}
                    updateLetterStyle={updateLetterStyle}
                    handleInsertQuote={handleInsertQuote}
                    scrollToQuoteInConversation={scrollToQuoteInConversation}
                    conversation={conversation}
                    shouldShowConversation={shouldShowConversation}
                    linkPopoverOpen={linkPopoverOpen}
                    setLinkPopoverOpen={setLinkPopoverOpen}
                    stylePopoverOpen={stylePopoverOpen}
                    setStylePopoverOpen={setStylePopoverOpen}
                    paperStylePopoverOpen={paperStylePopoverOpen}
                    setPaperStylePopoverOpen={setPaperStylePopoverOpen}
                    linkText={linkText}
                    setLinkText={setLinkText}
                    linkUrl={linkUrl}
                    setLinkUrl={setLinkUrl}
                    insertLink={insertLink}
                    isSaving={isSaving}
                    lastSaved={lastSaved}
                    formatLastSaved={formatLastSaved}
                    handleAutoSave={handleAutoSave}
                    handleSend={handleSend}
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Conversation History Column - Now comes second in side-by-side mode */}
            {shouldShowConversation && (viewMode === 'side-by-side' || viewMode === 'overlay') && (
              <div className={`space-y-4 ${viewMode === 'overlay' ? 'absolute inset-0 z-0 opacity-15 pointer-events-none' : ''} ${viewMode === 'side-by-side' ? 'order-1 md:order-2' : ''}`}>
                {viewMode === 'side-by-side' && (
                  <h2 className="text-lg font-medium font-serif">Conversation History</h2>
                )}
                
                <ConversationHistory 
                  conversation={conversation}
                  activeMessageId={activeQuoteId}
                  onScrollToQuote={scrollToQuoteInConversation}
                  viewMode={viewMode}
                  showComposeButton={viewMode !== 'side-by-side'}
                  expandable={viewMode === 'side-by-side'}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Compose;
