
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface NoColorButtonProps {
  onRemoveColor: () => void;
  handleMouseDown: (e: React.MouseEvent) => void;
}

const NoColorButton: React.FC<NoColorButtonProps> = ({ onRemoveColor, handleMouseDown }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onRemoveColor}
      className="w-full justify-start"
      onMouseDown={handleMouseDown}
    >
      <div className="w-4 h-4 mr-2 border rounded flex items-center justify-center">
        <X className="h-3 w-3" />
      </div>
      No Color
    </Button>
  );
};

export default NoColorButton;
