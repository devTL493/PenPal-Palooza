
import React from 'react';
import ComposeLetterButton from '@/components/letter/ComposeLetterButton';
import { PenTool } from 'lucide-react';

interface LetterActionsProps {
  letterId: string;
  senderName: string;
}

const LetterActions: React.FC<LetterActionsProps> = ({ letterId, senderName }) => {
  return (
    <div className="flex justify-between">
      <div />
      
      <div>
        <ComposeLetterButton recipientId={letterId} recipientName={senderName}>
          <PenTool className="mr-2 h-4 w-4" />
          Compose a Letter
        </ComposeLetterButton>
      </div>
    </div>
  );
};

export default LetterActions;
