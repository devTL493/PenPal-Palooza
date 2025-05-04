
import { useCallback, useState, useEffect } from 'react';
import { Editor, Transforms, Text } from 'slate';
import { CustomEditor } from './types';

export function useColorHandling(editor: CustomEditor) {
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  
  // Load recent colors from localStorage
  useEffect(() => {
    try {
      const savedColors = localStorage.getItem('recentTextColors');
      if (savedColors) {
        setRecentColors(JSON.parse(savedColors));
      }
    } catch (error) {
      console.error('Error loading recent colors:', error);
    }
  }, []);
  
  // Handle color change
  const handleColorChange = useCallback((color: string) => {
    // Apply the color to the selected text
    Editor.addMark(editor, 'color', color);
    
    // Update recent colors
    const updatedColors = [
      color,
      ...recentColors.filter(c => c !== color)
    ].slice(0, 3);
    
    setRecentColors(updatedColors);
    localStorage.setItem('recentTextColors', JSON.stringify(updatedColors));
  }, [editor, recentColors]);
  
  // Remove color formatting
  const handleRemoveColor = useCallback(() => {
    Editor.removeMark(editor, 'color');
  }, [editor]);
  
  return {
    colorPickerOpen,
    setColorPickerOpen,
    recentColors,
    setRecentColors,
    handleColorChange,
    handleRemoveColor
  };
}
