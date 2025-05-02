
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  measurementUnit?: 'mm' | 'in';
  setMeasurementUnit?: (unit: 'mm' | 'in') => void;
}

const PaperSizeSelector: React.FC<PaperSizeSelectorProps> = ({
  paperSize,
  setPaperSize,
  paperSizeOptions,
  customWidth,
  setCustomWidth,
  customHeight,
  setCustomHeight,
  isCustomSize,
  measurementUnit = 'mm',
  setMeasurementUnit
}) => {
  // Extract numeric value for sliders
  const getNumericValue = (value: string): number => {
    const match = value.match(/^([\d.]+)(mm|in)$/);
    if (!match) return 0;
    return parseFloat(match[1]);
  };
  
  // Format value with units
  const formatValue = (value: number): string => {
    return `${value}${measurementUnit}`;
  };
  
  // Handle slider changes
  const handleWidthSliderChange = (value: number[]) => {
    setCustomWidth(formatValue(value[0]));
  };
  
  const handleHeightSliderChange = (value: number[]) => {
    setCustomHeight(formatValue(value[0]));
  };

  // Get min, max values based on measurement unit
  const getSliderProps = () => {
    if (measurementUnit === 'mm') {
      return { 
        widthMin: 50, widthMax: 400, widthStep: 1,
        heightMin: 50, heightMax: 600, heightStep: 1
      };
    } else {
      return { 
        widthMin: 2, widthMax: 15, widthStep: 0.1,
        heightMin: 2, heightMax: 24, heightStep: 0.1
      };
    }
  };

  const sliderProps = getSliderProps();
  
  return (
    <div className="space-y-4">
      {/* Measurement Unit Toggle */}
      {setMeasurementUnit && (
        <div className="flex space-x-4 items-center">
          <Label>Measurement Unit:</Label>
          <RadioGroup 
            value={measurementUnit} 
            onValueChange={(v) => setMeasurementUnit(v as 'mm' | 'in')}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mm" id="mm" />
              <Label htmlFor="mm">mm</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in" id="in" />
              <Label htmlFor="in">in</Label>
            </div>
          </RadioGroup>
        </div>
      )}
      
      {/* Paper Size Selection */}
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
      
      {/* Custom Size Controls */}
      {isCustomSize && (
        <div className="space-y-4 p-3 border rounded-md bg-muted/20">
          <div className="grid grid-cols-2 gap-4">
            {/* Width Input Group */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="custom-width">Width</Label>
                <span className="text-sm">{customWidth}</span>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  id="custom-width"
                  value={getNumericValue(customWidth)}
                  onChange={(e) => setCustomWidth(formatValue(parseFloat(e.target.value) || 0))}
                  className="w-20"
                  type="number"
                  step={measurementUnit === 'mm' ? 1 : 0.1}
                />
                <span className="text-sm">{measurementUnit}</span>
              </div>
              <Slider
                id="custom-width-slider"
                min={sliderProps.widthMin}
                max={sliderProps.widthMax}
                step={sliderProps.widthStep}
                value={[getNumericValue(customWidth)]}
                onValueChange={handleWidthSliderChange}
              />
            </div>
            
            {/* Height Input Group */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="custom-height">Height</Label>
                <span className="text-sm">{customHeight}</span>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  id="custom-height"
                  value={getNumericValue(customHeight)}
                  onChange={(e) => setCustomHeight(formatValue(parseFloat(e.target.value) || 0))}
                  className="w-20"
                  type="number"
                  step={measurementUnit === 'mm' ? 1 : 0.1}
                />
                <span className="text-sm">{measurementUnit}</span>
              </div>
              <Slider
                id="custom-height-slider"
                min={sliderProps.heightMin}
                max={sliderProps.heightMax}
                step={sliderProps.heightStep}
                value={[getNumericValue(customHeight)]}
                onValueChange={handleHeightSliderChange}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Size Preview */}
      <div className="relative h-40 border border-dashed border-muted-foreground/50 rounded-md flex items-center justify-center">
        <div 
          className="bg-muted/20 border border-dashed border-muted-foreground/20"
          style={{
            width: `${Math.min(getNumericValue(customWidth) * 0.2, 100)}%`,
            height: `${Math.min(getNumericValue(customHeight) * 0.2, 100)}%`,
            maxWidth: '95%',
            maxHeight: '95%'
          }}
        >
          <div className="text-xs text-center p-2 opacity-70">
            {paperSize === 'custom' ? 'Custom size' : paperSizeOptions.find(opt => opt.value === paperSize)?.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperSizeSelector;
