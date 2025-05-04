
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const fontFamilyOptions = [
  { value: 'serif', label: 'Serif' },
  { value: 'sans', label: 'Sans-Serif' },
  { value: 'mono', label: 'Courier Prime' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'merriweather', label: 'Merriweather' },
];

const fontSizeOptions = [
  { value: '8px', label: '8' },
  { value: '10px', label: '10' },
  { value: '12px', label: '12' },
  { value: '14px', label: '14' },
  { value: '16px', label: '16' },
  { value: '18px', label: '18' },
  { value: '20px', label: '20' },
  { value: '24px', label: '24' },
  { value: '30px', label: '30' },
  { value: '36px', label: '36' },
  { value: '48px', label: '48' },
  { value: '60px', label: '60' },
  { value: '72px', label: '72' },
];

const lineSpacingOptions = [
  { value: '1.0', label: 'Single (1.0)' },
  { value: '1.15', label: 'Default (1.15)' },
  { value: '1.5', label: 'One Half (1.5)' },
  { value: '2.0', label: 'Double (2.0)' },
];

interface TextStyleControlsProps {
  fontFamily: string;
  fontSize: string;
  isBold: boolean;
  lineSpacing: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
  onFontFamilyChange: (value: string) => void;
  onFontSizeChange: (value: string) => void;
  onBoldToggle: () => void;
  onLineSpacingChange: (value: string) => void;
  onAlignmentChange: (value: 'left' | 'center' | 'right' | 'justify') => void;
}

const TextStyleControls: React.FC<TextStyleControlsProps> = ({
  fontFamily,
  fontSize,
  isBold,
  lineSpacing,
  alignment,
  onFontFamilyChange,
  onFontSizeChange,
  onBoldToggle,
  onLineSpacingChange,
  onAlignmentChange,
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    // Important to prevent losing selection in the editor
    e.preventDefault();
  };

  return (
    <div className="p-4 space-y-4" onMouseDown={handleMouseDown}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="font-family">
          Font Family
        </label>
        <Select 
          value={fontFamily} 
          onValueChange={onFontFamilyChange}
        >
          <SelectTrigger id="font-family" className="w-[180px]" aria-label="Select font family" onMouseDown={handleMouseDown}>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent onMouseDown={handleMouseDown}>
            {fontFamilyOptions.map(option => (
              <SelectItem key={option.value} value={option.value} onMouseDown={handleMouseDown}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="font-size">
          Font Size
        </label>
        <Select 
          value={fontSize} 
          onValueChange={onFontSizeChange}
        >
          <SelectTrigger id="font-size" className="w-[180px]" aria-label="Select font size" onMouseDown={handleMouseDown}>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent onMouseDown={handleMouseDown}>
            {fontSizeOptions.map(option => (
              <SelectItem key={option.value} value={option.value} onMouseDown={handleMouseDown}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Font Weight</label>
        <div>
          <Button 
            variant={isBold ? "default" : "outline"}
            size="sm" 
            onClick={onBoldToggle}
            onMouseDown={handleMouseDown}
            className="w-full"
          >
            <Bold className="h-4 w-4 mr-2" />
            {isBold ? "Bold" : "Normal"}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="line-spacing">
          Line Spacing
        </label>
        <Select 
          value={lineSpacing} 
          onValueChange={onLineSpacingChange}
        >
          <SelectTrigger id="line-spacing" className="w-[180px]" aria-label="Select line spacing" onMouseDown={handleMouseDown}>
            <SelectValue placeholder="Select spacing" />
          </SelectTrigger>
          <SelectContent onMouseDown={handleMouseDown}>
            {lineSpacingOptions.map(option => (
              <SelectItem key={option.value} value={option.value} onMouseDown={handleMouseDown}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Text Alignment</label>
        <div className="flex space-x-2">
          <Button
            variant={alignment === 'left' ? "default" : "outline"}
            size="sm"
            onClick={() => onAlignmentChange('left')}
            onMouseDown={handleMouseDown}
            aria-label="Align left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={alignment === 'center' ? "default" : "outline"}
            size="sm"
            onClick={() => onAlignmentChange('center')}
            onMouseDown={handleMouseDown}
            aria-label="Align center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={alignment === 'right' ? "default" : "outline"}
            size="sm"
            onClick={() => onAlignmentChange('right')}
            onMouseDown={handleMouseDown}
            aria-label="Align right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant={alignment === 'justify' ? "default" : "outline"}
            size="sm"
            onClick={() => onAlignmentChange('justify')}
            onMouseDown={handleMouseDown}
            aria-label="Justify text"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextStyleControls;
