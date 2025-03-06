
import { useState, useEffect } from 'react';
import { InlineStyle, LetterStyle } from '@/types/letter';

interface UseLetterSaveProps {
  content: string;
  subject: string;
  recipient: string;
  inlineStyles: InlineStyle[];
  letterStyle: LetterStyle;
}

const useLetterSave = ({ 
  content, 
  subject, 
  recipient, 
  inlineStyles, 
  letterStyle 
}: UseLetterSaveProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleAutoSave = () => {
    setIsSaving(true);
    
    // Simulate saving to a database
    setTimeout(() => {
      setLastSaved(new Date());
      setIsSaving(false);
    }, 800);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    return `Last saved at ${lastSaved.toLocaleTimeString()}`;
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content.trim() || subject.trim()) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [content, subject, recipient, inlineStyles, letterStyle]);

  return {
    isSaving,
    lastSaved,
    handleAutoSave,
    formatLastSaved
  };
};

export default useLetterSave;
