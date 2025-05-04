
import { useState } from 'react';
import { TextAlignment, InlineStyle, LetterStyle, LetterSize } from '@/types/letter';
import { useDocumentStyle } from './letter/useDocumentStyle';
import { useInlineStyles } from './letter/useInlineStyles';
import { useToolbarVisibility } from './letter/useToolbarVisibility';
import { usePopovers } from './letter/usePopovers';
import { useTextFormatting } from './letter/useTextFormatting';

interface UseLetterFormattingProps {
  initialDocumentStyle?: {
    font: string;
    size: string;
    color: string;
    alignment: TextAlignment;
  };
  initialLetterStyle?: LetterStyle;
}

export function useLetterFormatting(props: UseLetterFormattingProps = {}) {
  // Use the smaller, focused hooks
  const documentStyleProps = useDocumentStyle(props);
  const inlineStylesProps = useInlineStyles();
  const toolbarVisibilityProps = useToolbarVisibility();
  const popoversProps = usePopovers();
  const textFormattingProps = useTextFormatting();
  
  return {
    // Document style props
    ...documentStyleProps,
    
    // Inline styles props
    ...inlineStylesProps,
    
    // Toolbar visibility props
    ...toolbarVisibilityProps,
    
    // Popovers props
    ...popoversProps,
    
    // Text formatting props
    ...textFormattingProps
  };
}
