
import React from 'react';
import { Bold, Italic, Underline } from 'lucide-react';
import FormatButton from '../FormatButton';

interface ToolbarFormatControlsProps {
  activeFormats: Record<string, boolean>;
  onFormatToggle: (format: string) => void;
}

const ToolbarFormatControls: React.FC<ToolbarFormatControlsProps> = ({
  activeFormats,
  onFormatToggle
}) => {
  return (
    <>
      <FormatButton 
        format="bold" 
        icon={<Bold className="h-4 w-4" />} 
        isActive={activeFormats?.bold || false} 
        onToggle={onFormatToggle}
      />
      <FormatButton 
        format="italic" 
        icon={<Italic className="h-4 w-4" />} 
        isActive={activeFormats?.italic || false} 
        onToggle={onFormatToggle}
      />
      <FormatButton 
        format="underline" 
        icon={<Underline className="h-4 w-4" />} 
        isActive={activeFormats?.underline || false} 
        onToggle={onFormatToggle}
      />
    </>
  );
};

export default ToolbarFormatControls;
