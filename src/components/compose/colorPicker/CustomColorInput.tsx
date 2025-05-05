
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette, Plus } from 'lucide-react';

interface CustomColorInputProps {
  initialColor: string;
  onColorChange: (color: string) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  showEyedropper?: boolean;
}

const CustomColorInput: React.FC<CustomColorInputProps> = ({
  initialColor,
  onColorChange,
  handleMouseDown,
  showEyedropper = true
}) => {
  const [customColor, setCustomColor] = useState(initialColor);

  // Handle color input change
  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onColorChange(color); // Apply color immediately
  };

  // Handle eyedropper if supported by the browser
  const handleEyedropper = async () => {
    if ('EyeDropper' in window) {
      try {
        // @ts-ignore: EyeDropper API might not be recognized by TypeScript
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result.sRGBHex) {
          setCustomColor(result.sRGBHex);
          onColorChange(result.sRGBHex); // Apply immediately
        }
      } catch (e) {
        console.error('Error using eyedropper:', e);
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <label 
            htmlFor="color-picker-input" 
            className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            title="Add Custom Color"
            onMouseDown={handleMouseDown}
          >
            <Plus className="h-4 w-4" />
            <input
              id="color-picker-input"
              type="color"
              value={customColor}
              onChange={handleColorInputChange}
              className="sr-only"
            />
          </label>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={4}
          collisionPadding={8}
          avoidCollisions
          className="!p-0 !overflow-visible"
        />
      </Popover>
      
      {/* Eyedropper button if supported */}
      {showEyedropper && 'EyeDropper' in window && (
        <button 
          className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={handleEyedropper}
          title="Pick Color from Screen"
          aria-label="Pick color from screen"
          type="button"
          onMouseDown={handleMouseDown}
        >
          <Palette className="h-4 w-4" />
        </button>
      )}
      
      {/* Color input display */}
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded border" 
          style={{ background: customColor }}
        />
        <input
          type="text"
          value={customColor}
          onChange={(e) => {
            setCustomColor(e.target.value);
            // Don't apply text color immediately on text input to prevent invalid colors
          }}
          className="px-2 py-1 text-sm border rounded w-20"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onColorChange(customColor);
            }
          }}
          onBlur={() => onColorChange(customColor)}
        />
      </div>
    </div>
  );
};

export default CustomColorInput;
