
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
  measurementUnit: 'mm' | 'in';
  setMeasurementUnit: (unit: 'mm' | 'in') => void;
  convertToCurrentUnit: (value: string) => string;
}

// This hook manages paper style and size selection
export function usePaperStyle(): UsePaperStyleResult {
  const [paperSize, setPaperSize] = useState<LetterSize>('a4');
  const [customWidth, setCustomWidth] = useState('210mm');
  const [customHeight, setCustomHeight] = useState('297mm');
  const [measurementUnit, setMeasurementUnit] = useState<'mm' | 'in'>('mm');
  
  // Convert between mm and inches
  const mmToInches = (mm: number): number => {
    return mm / 25.4;
  };
  
  const inchesToMm = (inches: number): number => {
    return inches * 25.4;
  };
  
  const convertToCurrentUnit = (value: string): string => {
    if (!value) return '';
    
    // Extract numeric value and unit
    const match = value.match(/^([\d.]+)(mm|in)$/);
    if (!match) return value;
    
    const numValue = parseFloat(match[1]);
    const unit = match[2];
    
    // Return as-is if already in current unit
    if ((unit === 'mm' && measurementUnit === 'mm') || 
        (unit === 'in' && measurementUnit === 'in')) {
      return value;
    }
    
    // Convert to target unit
    if (unit === 'mm' && measurementUnit === 'in') {
      return `${mmToInches(numValue).toFixed(2)}in`;
    } else if (unit === 'in' && measurementUnit === 'mm') {
      return `${inchesToMm(numValue).toFixed(0)}mm`;
    }
    
    return value;
  };
  
  const standardSizes: Record<string, {width: string, height: string, description: string}> = {
    'a3': { width: '297mm', height: '420mm', description: 'A3 - 297×420mm' },
    'a4': { width: '210mm', height: '297mm', description: 'A4 - 210×297mm' },
    'a5': { width: '148mm', height: '210mm', description: 'A5 - 148×210mm' },
    'a6': { width: '105mm', height: '148mm', description: 'A6 - 105×148mm' },
    'b3': { width: '353mm', height: '500mm', description: 'B3 - 353×500mm' },
    'b4': { width: '250mm', height: '353mm', description: 'B4 - 250×353mm' },
    'b5': { width: '176mm', height: '250mm', description: 'B5 - 176×250mm' },
    'b6': { width: '125mm', height: '176mm', description: 'B6 - 125×176mm' },
    'letter': { width: '215.9mm', height: '279.4mm', description: 'Letter - 8.5×11in' },
    'legal': { width: '215.9mm', height: '355.6mm', description: 'Legal - 8.5×14in' },
    'custom': { width: customWidth, height: customHeight, description: 'Custom dimensions' }
  };
  
  const paperSizeOptions: PaperSizeOption[] = Object.entries(standardSizes).map(([key, data]) => ({
    value: key as LetterSize,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    width: data.width,
    height: data.height,
    description: data.description
  }));
  
  // Helper to check if current size is custom
  const isCustomSize = paperSize === 'custom';
  
  // Get the dimensions for the current paper size
  const getPaperDimensions = () => {
    if (paperSize === 'custom') {
      return { width: customWidth, height: customHeight };
    }
    
    const option = paperSizeOptions.find(opt => opt.value === paperSize);
    if (!option) {
      return { width: '210mm', height: '297mm' }; // Default to A4
    }
    
    return { 
      width: convertToCurrentUnit(option.width),
      height: convertToCurrentUnit(option.height)
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
    isCustomSize,
    measurementUnit,
    setMeasurementUnit,
    convertToCurrentUnit
  };
}
