
/**
 * Toolbar control for color selection
 * Wraps the SlateColorPickerPopover component
 */
import React from 'react';
import SlateColorPickerPopover from '../../SlateColorPickerPopover';
import { ColorOption } from '@/types/letter';

interface ToolbarColorPickerControlProps {
  colorPickerOpen: boolean;
  setColorPickerOpen: (open: boolean) => void;
  onColorChange: (color: string) => void;
  onRemoveColor: () => void;
  onAddCustomColor: (color: string) => void;
  recentColors: string[];
  colorOptions: ColorOption[];
  handleMouseDown: (e: React.MouseEvent) => void;
}

const ToolbarColorPickerControl: React.FC<ToolbarColorPickerControlProps> = ({
  colorPickerOpen,
  setColorPickerOpen,
  onColorChange,
  onRemoveColor,
  onAddCustomColor,
  recentColors,
  colorOptions,
  handleMouseDown
}) => {
  return (
    <SlateColorPickerPopover
      colorPickerOpen={colorPickerOpen} 
      setColorPickerOpen={setColorPickerOpen}
      onColorChange={onColorChange}
      onRemoveColor={onRemoveColor}
      onAddCustomColor={onAddCustomColor}
      recentColors={recentColors}
      colorOptions={colorOptions}
      handleMouseDown={handleMouseDown}
    />
  );
};

export default ToolbarColorPickerControl;
