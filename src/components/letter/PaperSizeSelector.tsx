
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { LetterSize } from '@/types/letter';
import { PaperSizeOption } from '@/hooks/usePaperStyle';

interface PaperSizeSelectorProps {
  paperSize: LetterSize;
  setPaperSize: (size: LetterSize) => void;
  paperSizeOptions: PaperSizeOption[];
  customWidth: string;
  setCustomWidth: (width: string) => void;
  customHeight: string;
  setCustomHeight: (height: string) => void;
  isCustomSize: boolean;
}

const PaperSizeSelector: React.FC<PaperSizeSelectorProps> = ({
  paperSize,
  setPaperSize,
  paperSizeOptions,
  customWidth,
  setCustomWidth,
  customHeight,
  setCustomHeight,
  isCustomSize
}) => {
  // Convert mm string to number for slider
  const widthInMm = parseInt(customWidth.replace('mm', ''));
  const heightInMm = parseInt(customHeight.replace('mm', ''));
  
  // Handle slider changes
  const handleWidthSliderChange = (value: number[]) => {
    setCustomWidth(`${value[0]}mm`);
  };
  
  const handleHeightSliderChange = (value: number[]) => {
    setCustomHeight(`${value[0]}mm`);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="paper-size">Paper Size</Label>
        <Select
          value={paperSize}
          onValueChange={(value) => setPaperSize(value as LetterSize)}
        >
          <SelectTrigger id="paper-size" className="w-full">
            <SelectValue placeholder="Select paper size" />
          </SelectTrigger>
          <SelectContent>
            {paperSizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label} - {option.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {isCustomSize && (
        <div className="space-y-4 p-3 border rounded-md bg-muted/20">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="custom-width">Width</Label>
              <span className="text-sm">{customWidth}</span>
            </div>
            <Slider
              id="custom-width"
              min={100}
              max={300}
              step={1}
              value={[widthInMm]}
              onValueChange={handleWidthSliderChange}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="custom-height">Height</Label>
              <span className="text-sm">{customHeight}</span>
            </div>
            <Slider
              id="custom-height"
              min={100}
              max={420}
              step={1}
              value={[heightInMm]}
              onValueChange={handleHeightSliderChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperSizeSelector;
