
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
    font: 'font-mono', // Changed to mono font for typewriter-style
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
    getPaperDimensions,
    measurementUnit,
    setMeasurementUnit 
  } = paperSizeProps;

  // Auto-hide toolbar state
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [lastTypingTime, setLastTypingTime] = useState(0);

  // Popovers state
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [stylePopoverOpen, setStylePopoverOpen] = useState(false);
  const [paperStylePopoverOpen, setPaperStylePopoverOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

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
  
  // Apply formatting using execCommand for contentEditable
  const applyFormatting = (
    formatType: string, 
    value: any
  ) => {
    try {
      switch (formatType) {
        case 'bold':
          document.execCommand('bold');
          break;
        case 'italic':
          document.execCommand('italic');
          break;
        case 'underline':
          document.execCommand('underline');
          break;
        case 'font':
          // Apply font family using CSS classes
          applyInlineStyle('fontFamily', value);
          break;
        case 'size':
          // Apply font size using CSS classes
          applyInlineStyle('fontSize', value);
          break;
        case 'color':
          document.execCommand('foreColor', false, value);
          break;
        case 'alignment':
          if (value === 'text-left') {
            document.execCommand('justifyLeft');
          } else if (value === 'text-center') {
            document.execCommand('justifyCenter');
          } else if (value === 'text-right') {
            document.execCommand('justifyRight');
          }
          break;
        case 'removeFormat':
          document.execCommand('removeFormat');
          break;
      }
    } catch (err) {
      console.error('Error applying formatting:', err);
    }
  };
  
  // Helper to apply inline styles when execCommand doesn't have direct equivalent
  const applyInlineStyle = (property: string, value: string) => {
    try {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      
      if (range.collapsed) return; // No selection
      
      // Create span with the desired style
      const span = document.createElement('span');
      
      // Apply the style based on property
      if (property === 'fontFamily') {
        // Map font class to actual font-family
        const fontMap: {[key: string]: string} = {
          'font-mono': '"Courier New", Courier, monospace',
          'font-serif': 'Georgia, "Times New Roman", serif',
          'font-sans': 'Arial, Helvetica, sans-serif'
        };
        span.style.fontFamily = fontMap[value] || value;
      } else if (property === 'fontSize') {
        // Map size class to actual size
        const sizeMap: {[key: string]: string} = {
          'text-sm': '0.875rem',
          'text-base': '1rem',
          'text-lg': '1.125rem',
          'text-xl': '1.25rem'
        };
        span.style.fontSize = sizeMap[value] || value;
      }
      
      // Apply span to selection
      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
      
      // Reselect the content
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.addRange(newRange);
    } catch (err) {
      console.error('Error applying inline style:', err);
    }
  };

  const insertLink = (url: string) => {
    if (!url) return;

    // Simple URL validation
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = `https://${url}`;
    }

    try {
      document.execCommand('createLink', false, finalUrl);
      
      // Reset link fields
      setLinkText('');
      setLinkUrl('');
      setLinkPopoverOpen(false);
    } catch (err) {
      console.error('Error inserting link:', err);
    }
  };
  
  // Toolbar visibility management based on typing
  const handleContentChange = () => {
    setIsTyping(true);
    setLastTypingTime(Date.now());
    setIsToolbarVisible(false); // Hide toolbar when typing
    
    // Setup a timer to show toolbar again after user stops typing for 2 seconds
    const typingTimeout = setTimeout(() => {
      if (Date.now() - lastTypingTime > 1900) { // Check if no typing for ~2 seconds
        setIsTyping(false);
      }
    }, 2000);
    
    return () => clearTimeout(typingTimeout);
  };
  
  // Show toolbar on mouse movement
  const handleMouseMove = () => {
    if (!isTyping) {
      setIsToolbarVisible(true);
    }
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
    colorPickerOpen,
    setColorPickerOpen,
    updateLetterStyle,
    applyFormatting,
    insertLink,
    // Paper size related
    paperSize,
    setPaperSize: updatePaperSize,
    paperSizeProps,
    getPaperDimensions,
    measurementUnit,
    setMeasurementUnit,
    // Toolbar visibility
    isToolbarVisible,
    setIsToolbarVisible,
    isTyping,
    handleContentChange,
    handleMouseMove
  };
}
