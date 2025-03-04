
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Type, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon 
} from 'lucide-react';
import { TextAlignment } from '@/types/letter';

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

interface TextFormatToolbarProps {
  selectionRange: { start: number; end: number } | null;
  activeTextFormat: {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    font: string;
    size: string;
    color: string;
    alignment: TextAlignment;
  };
  applyFormatting: (formatType: string, value: any) => void;
  insertLink: () => void;
  linkText: string;
  setLinkText: React.Dispatch<React.SetStateAction<string>>;
  linkUrl: string;
  setLinkUrl: React.Dispatch<React.SetStateAction<string>>;
  linkPopoverOpen: boolean;
  setLinkPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  stylePopoverOpen: boolean;
  setStylePopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TextFormatToolbar: React.FC<TextFormatToolbarProps> = ({
  selectionRange,
  activeTextFormat,
  applyFormatting,
  insertLink,
  linkText,
  setLinkText,
  linkUrl,
  setLinkUrl,
  linkPopoverOpen,
  setLinkPopoverOpen,
  stylePopoverOpen,
  setStylePopoverOpen
}) => {
  return (
    <>
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
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Text to display"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">URL</label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            
            <Button onClick={insertLink} className="w-full">Insert Link</Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default TextFormatToolbar;
