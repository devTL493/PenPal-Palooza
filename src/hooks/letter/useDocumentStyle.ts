
import { useState } from 'react';
import { TextAlignment, LetterStyle, LetterSize } from '@/types/letter';
import { usePaperStyle } from '../usePaperStyle';

interface UseDocumentStyleProps {
  initialDocumentStyle?: {
    font: string;
    size: string;
    color: string;
    alignment: TextAlignment;
  };
  initialLetterStyle?: LetterStyle;
}

export function useDocumentStyle({
  initialDocumentStyle = {
    font: 'font-mono',
    size: 'text-lg',
    color: 'text-black',
    alignment: 'text-left' as TextAlignment,
  },
  initialLetterStyle = {
    paperStyle: 'bg-paper',
    borderStyle: 'border-none',
    paperSize: 'a4' as LetterSize,
  }
}: UseDocumentStyleProps = {}) {
  // Style for the whole document
  const [documentStyle, setDocumentStyle] = useState(initialDocumentStyle);
  
  // Letter styling state
  const [letterStyle, setLetterStyle] = useState<LetterStyle>(initialLetterStyle);

  // Paper size management with the hook
  const paperSizeProps = usePaperStyle();
  const { 
    paperSize, 
    setPaperSize, 
    getPaperDimensions,
    measurementUnit,
    setMeasurementUnit 
  } = paperSizeProps;

  const updateLetterStyle = (type: 'paperStyle' | 'borderStyle', value: string) => {
    setLetterStyle(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Update paper size
  const updatePaperSize = (size: LetterSize) => {
    setPaperSize(size);
    setLetterStyle(prev => ({
      ...prev,
      paperSize: size
    }));
  };

  return {
    documentStyle,
    setDocumentStyle,
    letterStyle,
    setLetterStyle,
    updateLetterStyle,
    // Paper size related
    paperSize,
    setPaperSize: updatePaperSize,
    paperSizeProps,
    getPaperDimensions,
    measurementUnit,
    setMeasurementUnit
  };
}
