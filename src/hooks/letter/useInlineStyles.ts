
import { useState } from 'react';
import { InlineStyle } from '@/types/letter';

export function useInlineStyles() {
  // Inline styling for specific text selections
  const [inlineStyles, setInlineStyles] = useState<InlineStyle[]>([]);
  
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
  
  return {
    inlineStyles,
    setInlineStyles,
    applyInlineStyle
  };
}
