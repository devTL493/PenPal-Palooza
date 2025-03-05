
import React from 'react';

interface LetterContentProps {
  content: string;
  preview?: string;
  showContent: boolean;
}

const LetterContent: React.FC<LetterContentProps> = ({ 
  content, 
  preview, 
  showContent 
}) => {
  if (!showContent) return null;
  
  return (
    <div className="paper p-8 border rounded-md mb-6 whitespace-pre-line font-serif">
      {content || preview}
    </div>
  );
};

export default LetterContent;
