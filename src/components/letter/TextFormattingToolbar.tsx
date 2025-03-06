
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TextAlignment } from '@/types/letter';
import { FontOption, FontSizeOption, ColorOption } from '@/types/letter';

interface TextFormattingToolbarProps {
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
  fontOptions: FontOption[];
  fontSizeOptions: FontSizeOption[];
  colorOptions: ColorOption[];
  stylePopoverOpen: boolean;
  setStylePopoverOpen: (open: boolean) => void;
  applyFormatting: (formatType: string, value: any) => void;
}

const TextFormattingToolbar: React.FC<TextFormattingToolbarProps> = ({
  selectionRange,
  activeTextFormat,
  fontOptions,
  fontSizeOptions,
  colorOptions,
  stylePopoverOpen,
  setStylePopoverOpen,
  applyFormatting
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
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.color }}></div>
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Alignment</label>
              <div className="flex gap-2">
                <Button 
                  variant={activeTextFormat.alignment === 'text-left' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => applyFormatting('alignment', 'text-left')}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant={activeTextFormat.alignment === 'text-center' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => applyFormatting('alignment', 'text-center')}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button 
                  variant={activeTextFormat.alignment === 'text-right' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => applyFormatting('alignment', 'text-right')}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Button
        variant={activeTextFormat.isBold ? 'default' : 'outline'}
        size="sm"
        onClick={() => applyFormatting('bold', !activeTextFormat.isBold)}
        disabled={!selectionRange}
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activeTextFormat.isItalic ? 'default' : 'outline'}
        size="sm"
        onClick={() => applyFormatting('italic', !activeTextFormat.isItalic)}
        disabled={!selectionRange}
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activeTextFormat.isUnderline ? 'default' : 'outline'}
        size="sm"
        onClick={() => applyFormatting('underline', !activeTextFormat.isUnderline)}
        disabled={!selectionRange}
      >
        <Underline className="h-4 w-4" />
      </Button>
    </>
  );
};

export default TextFormattingToolbar;
