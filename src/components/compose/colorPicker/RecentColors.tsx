
import React from 'react';

interface RecentColorsProps {
  colors: string[];
  onColorSelect: (color: string) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
}

const RecentColors: React.FC<RecentColorsProps> = ({
  colors,
  onColorSelect,
  handleMouseDown
}) => {
  if (!colors.length) return null;
  
  return (
    <>
      {colors.map((color, index) => (
        <button
          key={`recent-${index}`}
          className="w-8 h-8 rounded border hover:scale-110 transition-transform"
          style={{ background: color }}
          onClick={() => onColorSelect(color)}
          title="Recent custom color"
          aria-label={`Recent color ${color}`}
          type="button"
          onMouseDown={handleMouseDown}
        />
      ))}
    </>
  );
};

export default RecentColors;
