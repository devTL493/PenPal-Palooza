
import React, { useState } from 'react';
import LetterHeader from '@/components/letter/LetterHeader';
import LetterContent from '@/components/letter/LetterContent';
import LetterActions from '@/components/letter/LetterActions';
import ComposeLetterButton from '@/components/letter/ComposeLetterButton';
import PaperStylePopover from '@/components/letter/PaperStylePopover';
import { Button } from "@/components/ui/button";
import { Palette } from 'lucide-react';
import { usePaperStyle } from '@/hooks/usePaperStyle';

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
  // Paper styling state
  const [paperStylePopoverOpen, setPaperStylePopoverOpen] = useState(false);
  const [letterStyle, setLetterStyle] = useState({
    paperStyle: 'bg-paper',
    borderStyle: 'border-none'
  });

  // Paper size functionality
  const paperSizeProps = usePaperStyle();
  const paperDimensions = paperSizeProps.getPaperDimensions();

  // Paper and border style options
  const paperStyleOptions = [
    { value: 'bg-paper', label: 'White', description: 'Clean white paper' },
    { value: 'bg-cream', label: 'Cream', description: 'Warm cream-colored paper' },
    { value: 'bg-vintage', label: 'Vintage', description: 'Aged vintage-look paper' }
  ];

  const borderStyleOptions = [
    { value: 'border-none', label: 'None', description: 'No border' },
    { value: 'border-simple', label: 'Simple', description: 'Clean, minimal border' },
    { value: 'border-ornate', label: 'Ornate', description: 'Decorative ornamental border' }
  ];

  // Update letter style
  const updateLetterStyle = (type: 'paperStyle' | 'borderStyle', value: string) => {
    setLetterStyle(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className={`p-4 h-full overflow-y-auto space-y-6 ${letterStyle.paperStyle} ${letterStyle.borderStyle}`}
         style={{
           width: paperDimensions.width,
           minHeight: paperDimensions.height,
           margin: '0 auto'
         }}>
      <div className="mb-2 flex justify-between items-center">
        <PaperStylePopover
          paperStylePopoverOpen={paperStylePopoverOpen}
          setPaperStylePopoverOpen={setPaperStylePopoverOpen}
          paperStyleOptions={paperStyleOptions}
          borderStyleOptions={borderStyleOptions}
          letterStyle={letterStyle}
          updateLetterStyle={updateLetterStyle}
          paperSizeProps={{
            paperSize: paperSizeProps.paperSize,
            setPaperSize: paperSizeProps.setPaperSize,
            paperSizeOptions: paperSizeProps.paperSizeOptions,
            customWidth: paperSizeProps.customWidth,
            setCustomWidth: paperSizeProps.setCustomWidth,
            customHeight: paperSizeProps.customHeight,
            setCustomHeight: paperSizeProps.setCustomHeight,
            isCustomSize: paperSizeProps.isCustomSize
          }}
        />
        
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
