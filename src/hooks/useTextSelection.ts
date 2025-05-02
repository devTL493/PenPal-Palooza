
import { useState, useEffect, RefObject } from 'react';
import { InlineStyle, TextAlignment } from '@/types/letter';

interface UseTextSelectionProps {
  editorRef: RefObject<HTMLDivElement>;
  content: string;
  inlineStyles: InlineStyle[];
  documentStyle: {
    font: string;
    size: string;
    color: string;
    alignment: TextAlignment;
  };
}

interface TextFormat {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  font: string;
  size: string;
  color: string;
  alignment: TextAlignment;
}

const useTextSelection = ({ 
  editorRef, 
  content, 
  inlineStyles, 
  documentStyle 
}: UseTextSelectionProps) => {
  const [selectionRange, setSelectionRange] = useState<{start: number, end: number} | null>(null);
  const [isFormatToolbarOpen, setIsFormatToolbarOpen] = useState(false);
  const [activeTextFormat, setActiveTextFormat] = useState<TextFormat>({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    font: documentStyle.font,
    size: documentStyle.size,
    color: documentStyle.color,
    alignment: documentStyle.alignment,
  });

  // Update active formats based on current selection
  const updateActiveFormats = () => {
    const selection = window.getSelection();
    
    if (!selection || selection.rangeCount === 0) return;
    
    // Get the selected node to check its formatting
    const selectedNode = selection.anchorNode;
    if (!selectedNode) return;
    
    // Find the closest element to the selection
    let element: Element | null = null;
    
    if (selectedNode.nodeType === Node.TEXT_NODE && selectedNode.parentElement) {
      element = selectedNode.parentElement;
    } else if (selectedNode.nodeType === Node.ELEMENT_NODE) {
      element = selectedNode as Element;
    }
    
    if (!element) return;
    
    // Check formatting properties
    const computedStyle = window.getComputedStyle(element);
    
    // Extract formatting information
    const isBold = computedStyle.fontWeight === 'bold' || parseInt(computedStyle.fontWeight) >= 700;
    const isItalic = computedStyle.fontStyle === 'italic';
    const isUnderline = computedStyle.textDecoration.includes('underline');
    const color = computedStyle.color;
    
    // Update active format state
    setActiveTextFormat(prev => ({
      ...prev,
      isBold,
      isItalic,
      isUnderline,
      color: rgbToHex(color) || documentStyle.color
    }));
  };
  
  // Helper to convert RGB to HEX
  const rgbToHex = (rgb: string): string | null => {
    if (!rgb) return null;
    
    // Handle rgb format
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    
    // Handle rgba format
    const matchRgba = rgb.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)$/);
    if (matchRgba) {
      const r = parseInt(matchRgba[1]);
      const g = parseInt(matchRgba[2]);
      const b = parseInt(matchRgba[3]);
      
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    
    return rgb; // If already in hex or other format
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      
      if (!selection) return;
      
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        if (range && !range.collapsed) {
          // Get approximate character positions
          setSelectionRange({ 
            start: range.startOffset, 
            end: range.endOffset 
          });
          setIsFormatToolbarOpen(true);
          
          // Update active formats based on selection
          updateActiveFormats();
        } else {
          setSelectionRange(null);
          setIsFormatToolbarOpen(false);
        }
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [content]);

  return {
    selectionRange,
    setSelectionRange,
    isFormatToolbarOpen,
    setIsFormatToolbarOpen,
    activeTextFormat,
    setActiveTextFormat,
    updateActiveFormats
  };
};

export default useTextSelection;
