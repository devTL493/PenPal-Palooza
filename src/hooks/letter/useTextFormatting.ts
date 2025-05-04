
import { useCallback } from 'react';
import { useInlineStyles } from './useInlineStyles';

export function useTextFormatting() {
  const { applyInlineStyle } = useInlineStyles();
  
  // Apply formatting using execCommand for contentEditable
  const applyFormatting = useCallback((formatType: string, value: any) => {
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
  }, [applyInlineStyle]);
  
  return {
    applyFormatting
  };
}
