
import React from 'react';
import { Button } from "@/components/ui/button";
import { Type } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TextStyleControls from '../TextStyleControls';

interface ToolbarTextStyleControlProps {
  stylePopoverOpen: boolean;
  setStylePopoverOpen: (open: boolean) => void;
  textStyles: {
    fontFamily: string;
    fontSize: string;
    lineSpacing: string;
    alignment: 'left' | 'center' | 'right' | 'justify';
  };
  activeFormats: Record<string, boolean>;
  onFontFamilyChange: (value: string) => void;
  onFontSizeChange: (value: string) => void;
  onFormatToggle: (format: string) => void;
  onLineSpacingChange: (value: string) => void;
  onAlignmentChange: (value: 'left' | 'center' | 'right' | 'justify') => void;
  handleMouseDown: (e: React.MouseEvent) => void;
}

const ToolbarTextStyleControl: React.FC<ToolbarTextStyleControlProps> = ({
  stylePopoverOpen,
  setStylePopoverOpen,
  textStyles,
  activeFormats,
  onFontFamilyChange,
  onFontSizeChange,
  onFormatToggle,
  onLineSpacingChange,
  onAlignmentChange,
  handleMouseDown
}) => {
  return (
    <Popover open={stylePopoverOpen} onOpenChange={setStylePopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" onMouseDown={handleMouseDown}>
          <Type className="h-4 w-4 mr-2" />
          Text Style
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <TextStyleControls
          fontFamily={textStyles.fontFamily}
          fontSize={textStyles.fontSize}
          isBold={activeFormats?.bold || false}
          lineSpacing={textStyles.lineSpacing}
          alignment={textStyles.alignment}
          onFontFamilyChange={onFontFamilyChange}
          onFontSizeChange={onFontSizeChange}
          onBoldToggle={() => onFormatToggle('bold')}
          onLineSpacingChange={onLineSpacingChange}
          onAlignmentChange={onAlignmentChange}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ToolbarTextStyleControl;
