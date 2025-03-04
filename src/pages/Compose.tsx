
import React, { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface TextStyle {
  font: string;
  size: string;
  color: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  alignment: 'text-left' | 'text-center' | 'text-right';
}

interface LetterStyle {
  paperStyle: string;
  borderStyle: string;
}

interface Link {
  text: string;
  url: string;
}

const Compose = () => {
  const { toast } = useToast();
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Text styling state
  const [textStyle, setTextStyle] = useState<TextStyle>({
    font: 'font-serif',
    size: 'text-lg',
    color: 'text-black',
    isBold: false,
    isItalic: false,
    isUnderline: false,
    alignment: 'text-left',
  });
  
  // Letter styling state
  const [letterStyle, setLetterStyle] = useState<LetterStyle>({
    paperStyle: 'bg-paper',
    borderStyle: 'border-none',
  });

  // Link insertion
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  
  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content.trim() || subject.trim() || recipient) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [content, subject, recipient, textStyle, letterStyle]);

  const handleAutoSave = () => {
    setIsSaving(true);
    
    // Simulate saving to a database
    setTimeout(() => {
      setLastSaved(new Date());
      setIsSaving(false);
    }, 800);
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
      textStyle,
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
    setLastSaved(null);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    return `Last saved at ${lastSaved.toLocaleTimeString()}`;
  };

  const insertLink = () => {
    if (!linkText || !linkUrl) {
      toast({
        title: "Both link text and URL are required",
        description: "Please enter both link text and URL.",
        variant: "destructive",
      });
      return;
    }

    // Simple URL validation
    if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
      setLinkUrl(`https://${linkUrl}`);
    }

    // Insert markdown-style link into content
    const linkMarkdown = `[${linkText}](${linkUrl})`;
    const textAreaElement = document.getElementById('letter-content') as HTMLTextAreaElement;
    
    if (textAreaElement) {
      const start = textAreaElement.selectionStart;
      const end = textAreaElement.selectionEnd;
      
      const newContent = 
        content.substring(0, start) + 
        linkMarkdown + 
        content.substring(end);
      
      setContent(newContent);
      
      // Reset link fields
      setLinkText('');
      setLinkUrl('');
      setLinkPopoverOpen(false);
      
      // Focus back on textarea
      setTimeout(() => {
        textAreaElement.focus();
        textAreaElement.selectionStart = start + linkMarkdown.length;
        textAreaElement.selectionEnd = start + linkMarkdown.length;
      }, 0);
    }
  };

  // Generate combined class string for the letter content
  const letterContentClasses = `
    ${textStyle.font} 
    ${textStyle.size} 
    ${textStyle.color} 
    ${textStyle.isBold ? 'font-bold' : 'font-normal'} 
    ${textStyle.isItalic ? 'italic' : ''} 
    ${textStyle.isUnderline ? 'underline' : ''} 
    ${textStyle.alignment} 
    min-h-[300px] leading-relaxed resize-none focus-visible:ring-0 border-0 p-0 shadow-none
  `;

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
          
          <Tabs defaultValue="compose" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="text-style">Text Style</TabsTrigger>
              <TabsTrigger value="letter-style">Letter Style</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text-style" className="space-y-4">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-medium">Text Styling Options</h2>
                  <p className="text-muted-foreground">
                    Customize how your text appears to your pen pal
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Font Family</label>
                      <Select 
                        value={textStyle.font} 
                        onValueChange={(value) => setTextStyle({...textStyle, font: value})}
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
                      <label className="text-sm font-medium">Font Size</label>
                      <Select 
                        value={textStyle.size} 
                        onValueChange={(value) => setTextStyle({...textStyle, size: value})}
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
                      <label className="text-sm font-medium">Text Color</label>
                      <Select 
                        value={textStyle.color} 
                        onValueChange={(value) => setTextStyle({...textStyle, color: value})}
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
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={textStyle.isBold ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextStyle({...textStyle, isBold: !textStyle.isBold})}
                    >
                      <Bold className="h-4 w-4" />
                      <span className="ml-2">Bold</span>
                    </Button>
                    
                    <Button
                      variant={textStyle.isItalic ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextStyle({...textStyle, isItalic: !textStyle.isItalic})}
                    >
                      <Italic className="h-4 w-4" />
                      <span className="ml-2">Italic</span>
                    </Button>
                    
                    <Button
                      variant={textStyle.isUnderline ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextStyle({...textStyle, isUnderline: !textStyle.isUnderline})}
                    >
                      <Underline className="h-4 w-4" />
                      <span className="ml-2">Underline</span>
                    </Button>
                    
                    <Button
                      variant={textStyle.alignment === 'text-left' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextStyle({...textStyle, alignment: 'text-left'})}
                    >
                      <AlignLeft className="h-4 w-4" />
                      <span className="ml-2">Left</span>
                    </Button>
                    
                    <Button
                      variant={textStyle.alignment === 'text-center' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextStyle({...textStyle, alignment: 'text-center'})}
                    >
                      <AlignCenter className="h-4 w-4" />
                      <span className="ml-2">Center</span>
                    </Button>
                    
                    <Button
                      variant={textStyle.alignment === 'text-right' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextStyle({...textStyle, alignment: 'text-right'})}
                    >
                      <AlignRight className="h-4 w-4" />
                      <span className="ml-2">Right</span>
                    </Button>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="text-sm font-medium mb-2">Preview:</h3>
                    <p className={`${textStyle.font} ${textStyle.size} ${textStyle.color} ${textStyle.isBold ? 'font-bold' : 'font-normal'} ${textStyle.isItalic ? 'italic' : ''} ${textStyle.isUnderline ? 'underline' : ''} ${textStyle.alignment}`}>
                      This is how your text will appear to your pen pal.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="letter-style" className="space-y-4">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-medium">Letter Styling Options</h2>
                  <p className="text-muted-foreground">
                    Customize the appearance of your letter
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Paper Style</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {paperStyleOptions.map((style) => (
                        <div
                          key={style.value}
                          className={`p-4 rounded-md cursor-pointer border-2 transition-all ${
                            letterStyle.paperStyle === style.value 
                              ? 'border-primary' 
                              : 'border-transparent hover:border-gray-200'
                          } ${style.value}`}
                          onClick={() => setLetterStyle({...letterStyle, paperStyle: style.value})}
                        >
                          <div className="h-20 flex items-center justify-center text-center">
                            <span>{style.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{style.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Border Style</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {borderStyleOptions.map((style) => (
                        <div
                          key={style.value}
                          className={`p-4 rounded-md cursor-pointer transition-all ${style.value} ${
                            letterStyle.borderStyle === style.value 
                              ? 'outline outline-2 outline-primary' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setLetterStyle({...letterStyle, borderStyle: style.value})}
                        >
                          <div className="h-20 flex items-center justify-center text-center">
                            <span>{style.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{style.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`p-6 rounded-md ${letterStyle.paperStyle} ${letterStyle.borderStyle}`}>
                    <h3 className="text-sm font-medium mb-2">Preview:</h3>
                    <p>This is how your letter's style will appear.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="compose">
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
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Add Link
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
                  </div>
                  
                  <Textarea
                    id="letter-content"
                    placeholder="Dear friend,&#10;&#10;Write your letter here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={letterContentClasses}
                  />
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Compose;
