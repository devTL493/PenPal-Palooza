
import React from 'react';
import { Button } from "@/components/ui/button";

interface FormatButtonProps {
  format: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onToggle: (format: string) => void;
}

const FormatButton = ({ format, icon, isActive = false, onToggle }: FormatButtonProps) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent losing selection
    onToggle(format);
  };
  
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      onMouseDown={handleToggle} // Use onMouseDown to prevent losing focus
    >
      {icon}
    </Button>
  );
};

export default FormatButton;
