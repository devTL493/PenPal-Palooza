
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette, Plus, X } from 'lucide-react';
import { ColorOption } from '@/types/letter';

interface SlateColorPickerPopoverProps {
  colorPickerOpen: boolean;
  setColorPickerOpen: (open: boolean) => void;
  onColorChange: (color: string) => void;
  onRemoveColor: () => void;
  onAddCustomColor: (color: string) => void;
  recentColors: string[];
  colorOptions: ColorOption[];
}

const SlateColorPickerPopover: React.FC<SlateColorPickerPopoverProps> = ({
  colorPickerOpen,
  setColorPickerOpen,
  onColorChange,
  onRemoveColor,
  onAddCustomColor,
  recentColors,
  colorOptions
}) => {
  const [customColor, setCustomColor] = useState("#000000");
  
  // Color palette groups
  const colorPalette = {
    grays: ['#000000', '#333333', '#555555', '#777777', '#999999', '#BBBBBB', '#DDDDDD', '#F5F5F5'],
    reds: ['#7F0000', '#9A0000', '#B71C1C', '#D32F2F', '#F44336', '#E57373', '#FFCDD2', '#FFEBEE'],
    blues: ['#0D47A1', '#1976D2', '#2196F3', '#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB', '#E3F2FD'],
    greens: ['#1B5E20', '#388E3C', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9', '#E8F5E9'],
  };
  
  // Flatten color palette for the grid 
  const flattenedPalette = Object.values(colorPalette).flat();
  
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
          className="relative"
        >
          <Palette className="h-4 w-4 mr-2" />
          Text Color
          <span 
            className="absolute bottom-1 right-1 h-2 w-2 rounded-full border" 
            style={{ background: recentColors[0] || '#000000' }}
          ></span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3 color-picker !overflow-visible" align="start">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Text Color</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setColorPickerOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* No Color option */}
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRemoveColor}
            className="w-full justify-start"
          >
            <div className="w-4 h-4 mr-2 border rounded flex items-center justify-center">
              <X className="h-3 w-3" />
            </div>
            No Color
          </Button>
        </div>
        
        {/* Color palette grid */}
        <div className="mt-3">
          <div className="grid grid-cols-8 gap-1">
            {flattenedPalette.map((color, index) => (
              <button
                key={`palette-${index}`}
                className="w-7 h-7 rounded hover:scale-110 transition-transform border"
                style={{ background: color }}
                onClick={() => onColorChange(color)}
                title={color}
                type="button"
                aria-label={`Color ${color}`}
              />
            ))}
          </div>
        </div>
        
        {/* Custom colors section */}
        <div className="mt-3">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Custom Colors</h4>
          
          <div className="flex flex-wrap gap-2">
            {/* Recent colors */}
            {recentColors.map((color, index) => (
              <button
                key={`recent-${index}`}
                className="w-8 h-8 rounded border hover:scale-110 transition-transform"
                style={{ background: color }}
                onClick={() => onColorChange(color)}
                title="Recent custom color"
                aria-label={`Recent color ${color}`}
                type="button"
              />
            ))}
            
            {/* Add custom color with auto-flipping popover */}
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <label 
                    htmlFor="color-picker-input" 
                    className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    title="Add Custom Color"
                  >
                    <Plus className="h-4 w-4" />
                    <input
                      id="color-picker-input"
                      type="color"
                      value={customColor}
                      onChange={handleColorChange}
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
              
              {/* Color input display */}
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border" 
                  style={{ background: customColor }}
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="px-2 py-1 text-sm border rounded w-20"
                />
                <Button 
                  size="sm" 
                  onClick={handleAddCustomColor}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SlateColorPickerPopover;
