
import React, { useState } from 'react';
import { TextAlignment, InlineStyle, LetterStyle, LetterSize } from '@/types/letter';
import { usePaperStyle } from './usePaperStyle';

interface UseLetterFormattingProps {
  initialDocumentStyle?: {
    font: string;
    size: string;
    color: string;
    alignment: TextAlignment;
  };
  initialLetterStyle?: LetterStyle;
}

export function useLetterFormatting({
  initialDocumentStyle = {
    font: 'font-serif',
    size: 'text-lg',
    color: 'text-black',
    alignment: 'text-left' as TextAlignment,
  },
  initialLetterStyle = {
    paperStyle: 'bg-paper',
    borderStyle: 'border-none',
    paperSize: 'a4' as LetterSize,
  }
}: UseLetterFormattingProps = {}) {
  // Style for the whole document
  const [documentStyle, setDocumentStyle] = useState(initialDocumentStyle);
  
  // Inline styling for specific text selections
  const [inlineStyles, setInlineStyles] = useState<InlineStyle[]>([]);
  
  // Letter styling state
  const [letterStyle, setLetterStyle] = useState<LetterStyle>(initialLetterStyle);

  // Paper size management with the new hook
  const paperSizeProps = usePaperStyle();
  const { 
    paperSize, 
    setPaperSize, 
    getPaperDimensions 
  } = paperSizeProps;

  // Popovers state
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [stylePopoverOpen, setStylePopoverOpen] = useState(false);
  const [paperStylePopoverOpen, setPaperStylePopoverOpen] = useState(false);

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
  
  const applyFormatting = (
    formatType: string, 
    value: any, 
    selectionRange: { start: number; end: number } | null,
    activeTextFormat: any
  ) => {
    if (!selectionRange) return;
    
    const { start, end } = selectionRange;
    
    // Create a new style object for this selection
    const newStyle: InlineStyle = {
      start,
      end,
      ...activeTextFormat
    };
    
    // Update the specific format that was changed
    switch (formatType) {
      case 'bold':
        newStyle.isBold = !activeTextFormat.isBold;
        break;
      case 'italic':
        newStyle.isItalic = !activeTextFormat.isItalic;
        break;
      case 'underline':
        newStyle.isUnderline = !activeTextFormat.isUnderline;
        break;
      case 'font':
        newStyle.font = value;
        break;
      case 'size':
        newStyle.size = value;
        break;
      case 'color':
        newStyle.color = value;
        break;
      case 'alignment':
        newStyle.alignment = value as TextAlignment;
        // Alignment affects the whole content
        setDocumentStyle(prev => ({ ...prev, alignment: value as TextAlignment }));
        break;
    }
    
    // Add this style to the array
    setInlineStyles(prev => [...prev, newStyle]);
  };

  const insertLink = (
    selectionRange: { start: number; end: number } | null,
    url: string
  ) => {
    if (!selectionRange || !url) return;

    // Simple URL validation
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = `https://${url}`;
    }

    const { start, end } = selectionRange;

    // Create new style for the link
    const newLinkStyle: InlineStyle = {
      start,
      end,
      isLink: true,
      linkUrl: finalUrl,
      color: 'text-blue-600',
      isUnderline: true,
    };

    setInlineStyles(prev => [...prev, newLinkStyle]);
    
    // Reset link fields
    setLinkText('');
    setLinkUrl('');
    setLinkPopoverOpen(false);
  };

  return {
    documentStyle,
    setDocumentStyle,
    inlineStyles,
    setInlineStyles,
    letterStyle,
    setLetterStyle,
    linkPopoverOpen,
    setLinkPopoverOpen,
    linkText,
    setLinkText,
    linkUrl,
    setLinkUrl,
    stylePopoverOpen,
    setStylePopoverOpen,
    paperStylePopoverOpen,
    setPaperStylePopoverOpen,
    updateLetterStyle,
    applyFormatting,
    insertLink,
    // Paper size related
    paperSize,
    setPaperSize: updatePaperSize,
    paperSizeProps,
    getPaperDimensions
  };
}
