import React from 'react';
import ComposeLetterButton from './ComposeLetterButton';
interface LetterActionsProps {
  letterId: string;
  senderName: string;
}
const LetterActions: React.FC<LetterActionsProps> = ({
  letterId,
  senderName
}) => {
  return <div className="flex justify-between">
      <div />
      <ComposeLetterButton recipientId={letterId} recipientName={senderName} conversation={true} className="bg-[the_styling_of_the_\"Compose_a_Letter\"_button] bg-[#0080ff]" />
    </div>;
};
export default LetterActions;