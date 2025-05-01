
import React from 'react';
import LetterHeader from '@/components/letter/LetterHeader';
import LetterContent from '@/components/letter/LetterContent';
import LetterActions from '@/components/letter/LetterActions';
import ComposeLetterButton from '@/components/letter/ComposeLetterButton';

interface LetterPanelProps {
  letter: {
    id: string;
    sender: {
      id?: string;
      name: string;
      avatar?: string;
    };
    preview: string;
    content: string;
    timestamp?: string;
    date?: string;
    hasAttachments?: boolean;
  };
  isFavorite: boolean;
  toggleFavorite: () => void;
}

const LetterPanel: React.FC<LetterPanelProps> = ({
  letter,
  isFavorite,
  toggleFavorite
}) => {
  return (
    <div className="p-4 h-full overflow-y-auto space-y-6">
      <div className="mb-2 flex justify-end">
        <ComposeLetterButton 
          recipientId={letter.sender.id || ''}
          recipientName={letter.sender.name}
          className="hidden sm:flex"
        />
      </div>
      
      <LetterHeader 
        letter={letter} 
        isFavorite={isFavorite} 
        toggleFavorite={toggleFavorite} 
      />
      
      <LetterContent 
        content={letter.content} 
        preview={letter.preview}
        showContent={true}
      />
      
      <LetterActions 
        letterId={letter.id} 
        senderName={letter.sender.name}
      />
    </div>
  );
};

export default LetterPanel;
