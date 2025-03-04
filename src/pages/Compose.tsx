
import React, { useState, useEffect, useRef } from 'react';
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
import { Send, Paperclip, Save, Clock, Type, Palette, Link as LinkIcon, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

interface InlineStyle {
  start: number;
  end: number;
  font?: string;
  size?: string;
  color?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  alignment?: 'text-left' | 'text-center' | 'text-right';
  isLink?: boolean;
  linkUrl?: string;
}

interface LetterStyle {
  paperStyle: string;
  borderStyle: string;
}

const Compose = () => {
  const { toast } = useToast();
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isFormatToolbarOpen, setIsFormatToolbarOpen] = useState(false);
  const [selectionRange, setSelectionRange] = useState<{start: number, end: number} | null>(null);
  
  // Style for the whole document (default styling)
  const [documentStyle, setDocumentStyle] = useState({
    font: 'font-serif',
    size: 'text-lg',
    color: 'text-black',
    alignment: 'text-left' as const,
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
        newStyle.alignment = value;
        setActiveTextFormat(prev => ({ ...prev, alignment: value }));
        // Alignment affects the whole content
        setDocumentStyle(prev => ({ ...prev, alignment: value }));
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

  // Function to render the styled content for preview
  const renderStyledContent = () => {
    if (!content) return <p className="text-gray-400">Your letter will appear here...</p>;
    
    // Create spans with appropriate styling
    let result = [];
    let lastIndex = 0;
    
    // Sort styles by start position
    const sortedStyles = [...inlineStyles].sort((a, b) => a.start - b.start);
    
    for (let i = 0; i < sortedStyles.length; i++) {
      const style = sortedStyles[i];
      
      // Add text before this style if needed
      if (style.start > lastIndex) {
        result.push(
          <span key={`plain-${lastIndex}`} className={`${documentStyle.font} ${documentStyle.size} ${documentStyle.color}`}>
            {content.substring(lastIndex, style.start)}
          </span>
        );
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
      result.push(
        <span key={`plain-end`} className={`${documentStyle.font} ${documentStyle.size} ${documentStyle.color}`}>
          {content.substring(lastIndex)}
        </span>
      );
    }
    
    return <div className={`${documentStyle.alignment} whitespace-pre-wrap`}>{result}</div>;
  };

  // Generate combined class string for the letter card
  const letterCardClasses = `
    paper 
    ${letterStyle.paperStyle} 
    ${letterStyle.borderStyle}
  `;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-medium mb-6">Compose Letter</h1>
          
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
                {/* Formatting toolbar that appears above the editor */}
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
                        <Input
                          placeholder="Link text"
                          value={linkText}
                          onChange={(e) => setLinkText(e.target.value)}
                        />
                        <Input
                          placeholder="URL (e.g., https://example.com)"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button size="sm" onClick={insertLink}>Insert</Button>
                      </div>
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
                      <h3 className="font-medium">Paper Style</h3>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Paper</label>
                        <Select 
                          value={letterStyle.paperStyle} 
                          onValueChange={(value) => setLetterStyle(prev => ({ ...prev, paperStyle: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select paper style" />
                          </SelectTrigger>
                          <SelectContent>
                            {paperStyleOptions.map((style) => (
                              <SelectItem key={style.value} value={style.value}>
                                {style.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Border</label>
                        <Select 
                          value={letterStyle.borderStyle} 
                          onValueChange={(value) => setLetterStyle(prev => ({ ...prev, borderStyle: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select border style" />
                          </SelectTrigger>
                          <SelectContent>
                            {borderStyleOptions.map((style) => (
                              <SelectItem key={style.value} value={style.value}>
                                {style.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className={`p-4 rounded-md ${letterStyle.paperStyle} ${letterStyle.borderStyle}`}>
                        <p className="text-sm">Preview of your paper style</p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Text editor */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Write your letter here:</label>
                  <Textarea
                    id="letter-content"
                    ref={textareaRef}
                    placeholder="Dear friend,&#10;&#10;Write your letter here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[300px] leading-relaxed resize-none"
                  />
                </div>
                
                {/* Live preview */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Preview:</label>
                  <div className={`border rounded-md p-4 min-h-[300px] ${letterStyle.paperStyle} ${letterStyle.borderStyle} overflow-auto`}>
                    {renderStyledContent()}
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t border-border pt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                {isSaving ? (
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 animate-pulse" />
                    Saving...
                  </span>
                ) : lastSaved ? (
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {formatLastSaved()}
                  </span>
                ) : null}
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Attach
                </Button>
                <Button variant="outline" size="sm" onClick={handleAutoSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button size="sm" onClick={handleSend}>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Compose;
