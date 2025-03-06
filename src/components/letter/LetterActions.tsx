
import React from 'react';
import { PenTool } from 'lucide-react';

interface LetterActionsProps {
  letterId: string;
  senderName: string;
}

const LetterActions: React.FC<LetterActionsProps> = ({ letterId, senderName }) => {
  return (
    <div className="flex justify-between">
      <div />
      <div />
    </div>
  );
};

export default LetterActions;
