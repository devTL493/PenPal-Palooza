
/**
 * Simple color palette grid component
 * Renders a grid of color swatches with hover effects
 */
import React from 'react';

interface ColorPaletteProps {
  colors: string[];
  onColorSelect: (color: string) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  onColorSelect,
  handleMouseDown
}) => {
  return (
    <div className="grid grid-cols-8 gap-1">
      {colors.map((color, index) => (
        <button
          key={`palette-${index}`}
          className="w-7 h-7 rounded hover:scale-110 transition-transform border"
          style={{ background: color }}
          onClick={() => onColorSelect(color)}
          title={color}
          type="button"
          aria-label={`Color ${color}`}
          onMouseDown={handleMouseDown}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
