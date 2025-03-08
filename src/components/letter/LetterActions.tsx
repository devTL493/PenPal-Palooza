
import React from 'react';

interface LetterActionsProps {
  letterId: string;
  senderName: string;
}

const LetterActions: React.FC<LetterActionsProps> = ({
  letterId,
  senderName
}) => {
  return (
    <div className="flex justify-between">
      <div />
      {/* ComposeLetterButton removed as requested */}
    </div>
  );
};

export default LetterActions;
