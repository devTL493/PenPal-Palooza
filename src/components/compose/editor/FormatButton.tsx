
import React from 'react';
import { useSlate } from 'slate-react';
import { Button } from "@/components/ui/button";

interface FormatButtonProps {
  format: string;
  icon: React.ReactNode;
}

const FormatButton = ({ format, icon }: FormatButtonProps) => {
  const editor = useSlate();
  
  const isActive = () => {
    // Safely check the editor marks
    const marks = editor.marks;
    return marks ? Boolean(marks[format as keyof typeof marks]) : false;
  };
  
  const toggleFormat = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isActive()) {
      editor.removeMark(format);
    } else {
      editor.addMark(format, true);
    }
  };
  
  return (
    <Button
      variant={isActive() ? 'default' : 'outline'}
      size="sm"
      onMouseDown={toggleFormat}
    >
      {icon}
    </Button>
  );
};

export default FormatButton;
