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
import { Send, Paperclip, Save, Clock, Type, Palette, Link as LinkIcon, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ComposeViewOption, { ComposeViewMode } from '@/components/letter/ComposeViewOption';
import QuoteSelection from '@/components/letter/QuoteSelection';
import ConversationHistory from '@/components/letter/ConversationHistory';
import StyledQuote from '@/components/letter/StyledQuote';

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

// Type for alignment
export type TextAlignment = 'text-left' | 'text-center' | 'text-right';

export interface InlineStyle {
  start: number;
  end: number;
  font?: string;
  size?: string;
  color?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  alignment?: TextAlignment;
  isLink?: boolean;
  linkUrl?: string;
}

export interface LetterStyle {
  paperStyle: string;
  borderStyle: string;
}

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
  
  // View mode state (new)
  const [viewMode, setViewMode] = useState<ComposeViewMode>('overlay');
  const [conversation, setConversation] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
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
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);

  // Used for styling the letter card
  const letterCardClasses = `overflow-hidden ${letterStyle.paperStyle} ${letterStyle.borderStyle}`;

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

  // Function to handle clicking on a quote to jump to its source
  const handleQuoteClick = (quoteId: string) => {
    setActiveQuoteId(quoteId);
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

  // Function to render the styled content for preview (modified to handle quotes)
  const renderStyledContent = () => {
    if (!content) return <p className="text-gray-400">Your letter will appear here...</p>;
    
    // Create spans with appropriate styling
    let result = [];
    let lastIndex = 0;
    
    // Parse blockquotes for styling
    const quoteRegex = /<blockquote data-sender="([^"]*)" data-date="([^"]*)">\n([\s\S]*?)\n<\/blockquote>/g;
    let match;
    let plainTextContent = content;
    let quoteMatches = [];
    
    // Extract all quotes and their metadata
    while ((match = quoteRegex.exec(content)) !== null) {
      quoteMatches.push({
        fullMatch: match[0],
        sender: match[1],
        date: match[2],
        text: match[3],
        index: match.index
      });
    }
    
    // Sort styles by start position
    const sortedStyles = [...inlineStyles].sort((a, b) => a.start - b.start);
    
    // First, handle regular styling
    for (let i = 0; i < sortedStyles.length; i++) {
      const style = sortedStyles[i];
      
      // Add text before this style if needed
      if (style.start > lastIndex) {
        const textSegment = content.substring(lastIndex, style.start);
        
        // Check if this segment contains quotes
        let segmentLastIndex = 0;
        let segmentResult = [];
        
        for (const quote of quoteMatches) {
          if (quote.index >= lastIndex && quote.index < style.start) {
            // Add text before the quote
            if (quote.index > lastIndex + segmentLastIndex) {
              segmentResult.push(
                content.substring(lastIndex + segmentLastIndex, quote.index)
              );
            }
            
            // Add the styled quote
            segmentResult.push(
              <StyledQuote 
                key={`quote-${quote.index}`}
                quote={quote}
                onClick={() => scrollToQuoteInConversation(`quote-${quote.index}`)}
              />
            );
            
            segmentLastIndex = (quote.index - lastIndex) + quote.fullMatch.length;
          }
        }
        
        // Add any remaining text
        if (segmentLastIndex < style.start - lastIndex) {
          segmentResult.push(
            content.substring(lastIndex + segmentLastIndex, style.start)
          );
        }
        
        // If we processed quotes, add the segments; otherwise, add the whole text
        if (segmentResult.length > 0) {
          result.push(
            <span key={`plain-${lastIndex}`} className={`${documentStyle.font} ${documentStyle.size} ${documentStyle.color}`}>
              {segmentResult}
            </span>
          );
        } else {
          result.push(
            <span key={`plain-${lastIndex}`} className={`${documentStyle.font} ${documentStyle.size} ${documentStyle.color}`}>
              {textSegment}
            </span>
          );
        }
      }
      
      // Create the styled span
      const spanClasses = `
        ${style.font || documentStyle.font}
        ${style.size || documentStyle.size}
        ${style.color || documentStyle.color}
        ${style.isBold ? 'font-bold' : ''}
        ${style.isItalic ? 'italic' : ''}
        ${style.isUnderline ? 'underline' : ''}
        ${style.isLink ? 'cursor-pointer' : ''}
      `;
      
      const styledText = content.substring(style.start, style.end);
      
      if (style.isLink) {
        result.push(
          <a 
            key={`styled-${style.start}-${style.end}`} 
            href={style.linkUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={spanClasses}
          >
            {styledText}
          </a>
        );
      } else {
        result.push(
          <span key={`styled-${style.start}-${style.end}`} className={spanClasses}>
            {styledText}
          </span>
        );
      }
      
      lastIndex = style.end;
    }
    
    // Add any remaining text after the last style
    if (lastIndex < content.length) {
      const remainingText = content.substring(lastIndex);
      
      // Check for quotes in the remaining text
      let segmentLastIndex = 0;
      let segmentResult = [];
      
      for (const quote of quoteMatches) {
        if (quote.index >= lastIndex) {
          // Add text before the quote
          if (quote.index > lastIndex + segmentLastIndex) {
            segmentResult.push(
              remainingText.substring(segmentLastIndex, quote.index - lastIndex)
            );
          }
          
          // Add the styled quote
          segmentResult.push(
            <StyledQuote 
              key={`quote-${quote.index}`}
              quote={quote}
              onClick={() => scrollToQuoteInConversation(`quote-${quote.index}`)}
            />
          );
          
          segmentLastIndex = (quote.index - lastIndex) + quote.fullMatch.length;
        }
      }
      
      // Add any remaining text
      if (segmentLastIndex < remainingText.length) {
        segmentResult.push(
          remainingText.substring(segmentLastIndex)
        );
      }
      
      // If we processed quotes, add the segments; otherwise, add the whole text
      if (segmentResult.length > 0) {
        result.push(
          <span key={`plain-end`} className={`${documentStyle.font} ${documentStyle.size} ${documentStyle.color}`}>
            {segmentResult}
          </span>
        );
      } else {
        result.push(
          <span key={`plain-end`} className={`${documentStyle.font} ${documentStyle.size} ${documentStyle.color}`}>
            {remainingText}
          </span>
        );
      }
    }
    
    return <div className={`${documentStyle.alignment} whitespace-pre-wrap`}>{result}</div>;
  };

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
            {shouldShowConversation && (
              <div className="space-y-4">
                {viewMode === 'side-by-side' && (
                  <h2 className="text-lg font-medium font-serif">Conversation History</h2>
                )}
                
                <ConversationHistory 
                  conversation={conversation}
                  activeMessageId={activeQuoteId}
                  onScrollToQuote={scrollToQuoteInConversation}
                />
              </div>
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
                    <Popover open={stylePopoverOpen} onOpenChange={setStylePopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Type className="h-4 w-4 mr-2" />
                          Text Style
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <h3 className="font-medium">Text Styling</h3>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Font</label>
                            <Select 
                              value={activeTextFormat.font} 
                              onValueChange={(value) => applyFormatting('font', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select font" />
                              </SelectTrigger>
                              <SelectContent>
                                {fontOptions.map((font) => (
                                  <SelectItem key={font.value} value={font.value} className={font.value}>
                                    {font.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Size</label>
                            <Select 
                              value={activeTextFormat.size} 
                              onValueChange={(value) => applyFormatting('size', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                {fontSizeOptions.map((size) => (
                                  <SelectItem key={size.value} value={size.value}>
                                    {size.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Color</label>
                            <Select 
                              value={activeTextFormat.color} 
                              onValueChange={(value) => applyFormatting('color', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select color" />
                              </SelectTrigger>
                              <SelectContent>
                                {colorOptions.map((color) => (
                                  <SelectItem key={color.value} value={color.value}>
                                    <div className="flex items-center">
                                      <div 
                                        className="w-4 h-4 mr-2 rounded-full" 
                                        style={{backgroundColor: color.color}}
                                      />
                                      {color.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    <Button 
                      variant={activeTextFormat.isBold ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => applyFormatting('bold', null)}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant={activeTextFormat.isItalic ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => applyFormatting('italic', null)}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant={activeTextFormat.isUnderline ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => applyFormatting('underline', null)}
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex h-full">
                      <Button 
                        variant={activeTextFormat.alignment === 'text-left' ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => applyFormatting('alignment', 'text-left')}
                        className="rounded-r-none"
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant={activeTextFormat.alignment === 'text-center' ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => applyFormatting('alignment', 'text-center')}
                        className="rounded-none border-x-0"
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant={activeTextFormat.alignment === 'text-right' ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => applyFormatting('alignment', 'text-right')}
                        className="rounded-l-none"
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Link
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <h3 className="font-medium">Insert Link</h3>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Link Text</label>
                            <Input
                              placeholder="Text to display"
                              value={linkText}
                              onChange={(e) => setLinkText(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">URL</label>
                            <Input
                              placeholder="https://example.com"
                              value={linkUrl}
                              onChange={(e) => setLinkUrl(e.target.value)}
                            />
                          </div>
                          
                          <Button onClick={insertLink}>
                            Insert Link
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    <Popover open={paperStylePopoverOpen} onOpenChange={setPaperStylePopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Palette className="h-4 w-4 mr-2" />
                          Paper Style
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <h3 className="font-medium">Paper Styling</h3>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Paper Color</label>
                            <div className="grid grid-cols-3 gap-2">
                              {paperStyleOptions.map((option) => (
                                <div
                                  key={option.value}
                                  className={`${option.value} border p-2 rounded cursor-pointer hover:opacity-80 transition-opacity text-center text-xs text-gray-700`}
                                  onClick={() => updateLetterStyle('paperStyle', option.value)}
                                >
                                  {option.label}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Border Style</label>
                            <div className="grid grid-cols-3 gap-2">
                              {borderStyleOptions.map((option) => (
                                <div
                                  key={option.value}
                                  className={`${option.value} bg-white p-2 rounded cursor-pointer hover:opacity-80 transition-opacity text-center text-xs text-gray-700`}
                                  onClick={() => updateLetterStyle('borderStyle', option.value)}
                                >
                                  {option.label}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    {shouldShowConversation && (
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Quote
                      </Button>
                    )}
                    
                    {isSaving && (
                      <div className="text-sm text-muted-foreground flex items-center ml-auto">
                        <Clock className="h-3 w-3 mr-1 animate-spin" />
                        Saving...
                      </div>
                    )}
                    
                    {!isSaving && lastSaved && (
                      <div className="text-sm text-muted-foreground ml-auto">
                        {formatLastSaved()}
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <Textarea
                      ref={textareaRef}
                      placeholder="Write your letter here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[300px] resize-y font-serif"
                    />
                    
                    <div className="absolute top-0 right-0">
                      {shouldShowConversation && (
                        <QuoteSelection
                          conversation={conversation}
                          onQuoteSelected={handleInsertQuote}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Preview</h3>
                    <div className={letterCardClasses + " p-4 rounded min-h-[100px]"}>
                      {renderStyledContent()}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="justify-between border-t border-border pt-4">
                  <Button variant="outline" onClick={handleAutoSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  
                  <Button onClick={handleSend}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Letter
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Compose;
