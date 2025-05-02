
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ColorPicker, Check } from "lucide-react";

interface ColorPickerPopoverProps {
  colorPickerOpen: boolean;
  setColorPickerOpen: (open: boolean) => void;
  selectionRange: { start: number; end: number } | null;
  onAddCustomColor: (color: string) => void;
  recentColors: string[];
  colorOptions: Array<{
    value: string;
    label: string;
    color: string;
    isCustom?: boolean;
  }>;
  applyFormatting: (formatType: string, value: any) => void;
}

const ColorPickerPopover: React.FC<ColorPickerPopoverProps> = ({
  colorPickerOpen,
  setColorPickerOpen,
  selectionRange,
  onAddCustomColor,
  recentColors,
  colorOptions,
  applyFormatting
}) => {
  const [customColor, setCustomColor] = useState("#000000");

  // Group color options (standard colors and recent custom colors)
  const standardColors = colorOptions.filter(color => !color.isCustom);
  const customColors = colorOptions.filter(color => color.isCustom);
  
  // Handle color input change
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
  };
  
  // Handle custom color submission
  const handleAddCustomColor = () => {
    onAddCustomColor(customColor);
    setColorPickerOpen(false);
  };

  return (
    <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={!selectionRange}
          className="relative"
        >
          <ColorPicker className="h-4 w-4 mr-2" />
          Text Color
          <span 
            className="absolute bottom-1 right-1 h-2 w-2 rounded-full border" 
            style={{ background: customColors[0]?.color || standardColors[0]?.color }}
          ></span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <h3 className="font-medium">Text Color</h3>
          
          {/* Standard color palette */}
          <div>
            <h4 className="text-sm font-medium mb-2">Standard Colors</h4>
            <div className="grid grid-cols-8 gap-1">
              {standardColors.map((color) => (
                <button
                  key={color.value}
                  className="w-6 h-6 rounded-full flex items-center justify-center border hover:scale-110 transition-transform"
                  style={{ background: color.color }}
                  onClick={() => applyFormatting('color', color.value)}
                  title={color.label}
                  type="button"
                >
                  {color.value === 'text-black' && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Recent colors section */}
          {customColors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Recent Colors</h4>
              <div className="flex gap-2">
                {customColors.map((color) => (
                  <button
                    key={color.value}
                    className="w-6 h-6 rounded-full border hover:scale-110 transition-transform"
                    style={{ background: color.color }}
                    onClick={() => applyFormatting('color', color.value)}
                    title="Recent custom color"
                    type="button"
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Custom color picker */}
          <div>
            <h4 className="text-sm font-medium mb-2">Custom Color</h4>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={customColor}
                onChange={handleColorChange}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border rounded"
              />
              <Button size="sm" onClick={handleAddCustomColor}>
                Add
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPickerPopover;
