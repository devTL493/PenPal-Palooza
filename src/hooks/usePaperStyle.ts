
import { useState } from 'react';
import { LetterSize } from '@/types/letter';

export interface PaperSizeOption {
  value: LetterSize;
  label: string;
  width: string;
  height: string;
  description: string;
}

export interface UsePaperStyleResult {
  paperSize: LetterSize;
  setPaperSize: (size: LetterSize) => void;
  paperSizeOptions: PaperSizeOption[];
  customWidth: string;
  setCustomWidth: (width: string) => void;
  customHeight: string;
  setCustomHeight: (height: string) => void;
  getPaperDimensions: () => { width: string; height: string };
  isCustomSize: boolean;
}

// This hook manages paper style and size selection
export function usePaperStyle(): UsePaperStyleResult {
  const [paperSize, setPaperSize] = useState<LetterSize>('a4');
  const [customWidth, setCustomWidth] = useState('210mm');
  const [customHeight, setCustomHeight] = useState('297mm');
  
  const paperSizeOptions: PaperSizeOption[] = [
    { 
      value: 'a4', 
      label: 'A4', 
      width: '210mm', 
      height: '297mm',
      description: 'Standard letter size in most countries (210×297mm)'
    },
    { 
      value: 'a5', 
      label: 'A5', 
      width: '148mm', 
      height: '210mm',
      description: 'Half the size of A4 (148×210mm)'
    },
    { 
      value: 'a6', 
      label: 'A6', 
      width: '105mm', 
      height: '148mm',
      description: 'Postcard size (105×148mm)'
    },
    { 
      value: 'b4', 
      label: 'B4', 
      width: '250mm', 
      height: '353mm',
      description: 'Between A3 and A4 in size (250×353mm)'
    },
    { 
      value: 'b5', 
      label: 'B5', 
      width: '176mm', 
      height: '250mm',
      description: 'Between A4 and A5 in size (176×250mm)'
    },
    { 
      value: 'b6', 
      label: 'B6', 
      width: '125mm', 
      height: '176mm',
      description: 'Between A5 and A6 in size (125×176mm)'
    },
    { 
      value: 'custom', 
      label: 'Custom', 
      width: customWidth, 
      height: customHeight,
      description: 'Define your own paper dimensions'
    },
  ];
  
  // Helper to check if current size is custom
  const isCustomSize = paperSize === 'custom';
  
  // Get the dimensions for the current paper size
  const getPaperDimensions = () => {
    if (paperSize === 'custom') {
      return { width: customWidth, height: customHeight };
    }
    
    const option = paperSizeOptions.find(opt => opt.value === paperSize);
    return { 
      width: option?.width || '210mm', // Default to A4 width
      height: option?.height || '297mm' // Default to A4 height
    };
  };
  
  return {
    paperSize,
    setPaperSize,
    paperSizeOptions,
    customWidth,
    setCustomWidth,
    customHeight,
    setCustomHeight,
    getPaperDimensions,
    isCustomSize
  };
}
