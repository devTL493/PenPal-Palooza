
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette, Check, Plus, Eyedropper, X } from "lucide-react";

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
  const [localRecentColors, setLocalRecentColors] = useState<string[]>([]);

  // Load recent colors from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('recentTextColors');
    if (saved) {
      try {
        const colors = JSON.parse(saved);
        if (Array.isArray(colors) && colors.length > 0) {
          setLocalRecentColors(colors.slice(0, 3));
        }
      } catch (e) {
        console.error('Error parsing recent colors from localStorage:', e);
      }
    }
  }, []);

  // Use both props and local storage for recent colors
  const allRecentColors = [...new Set([...recentColors, ...localRecentColors])].slice(0, 3);

  // Color palette groups
  const colorPalette = {
    grays: ['#000000', '#333333', '#555555', '#777777', '#999999', '#BBBBBB', '#DDDDDD', '#F5F5F5'],
    reds: ['#7F0000', '#9A0000', '#B71C1C', '#D32F2F', '#F44336', '#E57373', '#FFCDD2', '#FFEBEE'],
    oranges: ['#E65100', '#F57C00', '#FF9800', '#FFB74D', '#FFCC80', '#FFE0B2', '#FFF3E0', '#FFF8E1'],
    yellows: ['#F57F17', '#FBC02D', '#FFEB3B', '#FFF176', '#FFF59D', '#FFF9C4', '#FFFDE7', '#FFFDE7'],
    greens: ['#1B5E20', '#388E3C', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9', '#E8F5E9'],
    cyans: ['#006064', '#0097A7', '#00BCD4', '#4DD0E1', '#80DEEA', '#B2EBF2', '#E0F7FA', '#E0F7FA'],
    blues: ['#0D47A1', '#1976D2', '#2196F3', '#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB', '#E3F2FD'],
    purples: ['#4A148C', '#7B1FA2', '#9C27B0', '#AB47BC', '#BA68C8', '#CE93D8', '#E1BEE7', '#F3E5F5']
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
    
    // Save to localStorage
    const updatedColors = [customColor, ...allRecentColors.filter(c => c !== customColor)].slice(0, 3);
    localStorage.setItem('recentTextColors', JSON.stringify(updatedColors));
    setLocalRecentColors(updatedColors);
    
    setColorPickerOpen(false);
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
        }
      } catch (e) {
        console.error('Error using eyedropper:', e);
      }
    } else {
      console.log('EyeDropper API not supported in this browser');
    }
  };
  
  // Remove text formatting
  const handleRemoveFormatting = () => {
    applyFormatting('removeFormat', null);
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
          <Palette className="h-4 w-4 mr-2" />
          Text Color
          <span 
            className="absolute bottom-1 right-1 h-2 w-2 rounded-full border" 
            style={{ background: allRecentColors[0] || '#000000' }}
          ></span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 color-picker" align="start">
        <div className="p-3 space-y-4">
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
              onClick={handleRemoveFormatting}
              className="w-full justify-start"
            >
              <div className="w-4 h-4 mr-2 border rounded flex items-center justify-center">
                <X className="h-3 w-3" />
              </div>
              No Color
            </Button>
          </div>
          
          {/* Color palette grid */}
          <div>
            <div className="grid grid-cols-8 gap-1">
              {flattenedPalette.map((color, index) => (
                <button
                  key={`palette-${index}`}
                  className="w-7 h-7 rounded hover:scale-110 transition-transform border"
                  style={{ background: color }}
                  onClick={() => applyFormatting('color', color)}
                  title={color}
                  type="button"
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
          </div>
          
          {/* Custom colors section */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Custom Colors</h4>
            
            <div className="flex flex-wrap gap-2">
              {/* Recent colors */}
              {allRecentColors.map((color, index) => (
                <button
                  key={`recent-${index}`}
                  className="w-8 h-8 rounded border hover:scale-110 transition-transform"
                  style={{ background: color }}
                  onClick={() => applyFormatting('color', color)}
                  title="Recent custom color"
                  aria-label={`Recent color ${color}`}
                  type="button"
                />
              ))}
              
              {/* Add custom color */}
              <div className="flex gap-2">
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
                
                {/* Eyedropper button */}
                {'EyeDropper' in window && (
                  <button 
                    className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={handleEyedropper}
                    title="Pick Color from Screen"
                    aria-label="Pick color from screen with eyedropper tool"
                    type="button"
                  >
                    <Eyedropper className="h-4 w-4" />
                  </button>
                )}
                
                {/* Color input display */}
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded border" 
                    style={{ background: customColor }}
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="px-2 py-1 text-sm border rounded w-20"
                    />
                    <Button 
                      size="sm" 
                      className="ml-2" 
                      onClick={handleAddCustomColor}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPickerPopover;
