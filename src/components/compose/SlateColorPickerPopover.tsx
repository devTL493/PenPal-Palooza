
/**
 * Color picker popover component for the SlateJS editor
 * Provides a Radix UI popover with color palette, recent colors, and custom color input
 * Uses auto-flipping placement and applies colors immediately on selection
 */
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette, X } from 'lucide-react';
import { ColorOption } from '@/types/letter';

// Import our components
import ColorPalette from './colorPicker/ColorPalette';
import NoColorButton from './colorPicker/NoColorButton';
import CustomColorInput from './colorPicker/CustomColorInput';
import RecentColors from './colorPicker/RecentColors';
import { useColorPalette } from './colorPicker/useColorPalette';

interface SlateColorPickerPopoverProps {
  colorPickerOpen: boolean;
  setColorPickerOpen: (open: boolean) => void;
  onColorChange: (color: string) => void;
  onRemoveColor: () => void;
  onAddCustomColor: (color: string) => void;
  recentColors: string[];
  colorOptions: ColorOption[];
  handleMouseDown?: (e: React.MouseEvent) => void;
}

const SlateColorPickerPopover: React.FC<SlateColorPickerPopoverProps> = ({
  colorPickerOpen,
  setColorPickerOpen,
  onColorChange,
  onRemoveColor,
  onAddCustomColor,
  recentColors,
  colorOptions,
  handleMouseDown = (e) => e.preventDefault()
}) => {
  // Get color palette from our hook
  const { flattenedPalette } = useColorPalette();

  return (
    <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="relative"
          onMouseDown={handleMouseDown}
        >
          <Palette className="h-4 w-4 mr-2" />
          Text Color
          <span 
            className="absolute bottom-1 right-1 h-2 w-2 rounded-full border" 
            style={{ background: recentColors[0] || '#000000' }}
          ></span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-3 color-picker !overflow-visible" 
        align="start"
        side="bottom"
        sideOffset={4}
        collisionPadding={8}
        avoidCollisions
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Text Color</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setColorPickerOpen(false)}
            className="h-8 w-8 p-0"
            onMouseDown={handleMouseDown}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* No Color option */}
        <div>
          <NoColorButton 
            onRemoveColor={onRemoveColor} 
            handleMouseDown={handleMouseDown} 
          />
        </div>
        
        {/* Color palette grid */}
        <div className="mt-3">
          <ColorPalette 
            colors={flattenedPalette} 
            onColorSelect={onColorChange} 
            handleMouseDown={handleMouseDown} 
          />
        </div>
        
        {/* Custom colors section */}
        <div className="mt-3">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Custom Colors</h4>
          
          <div className="flex flex-wrap gap-2">
            {/* Recent colors */}
            <RecentColors 
              colors={recentColors} 
              onColorSelect={onColorChange} 
              handleMouseDown={handleMouseDown} 
            />
            
            {/* Custom color input */}
            <CustomColorInput 
              initialColor="#000000" 
              onColorChange={onColorChange} 
              handleMouseDown={handleMouseDown} 
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SlateColorPickerPopover;
