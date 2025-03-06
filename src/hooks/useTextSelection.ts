
import { useState, useEffect, RefObject } from 'react';
import { InlineStyle, TextAlignment } from '@/types/letter';

interface UseTextSelectionProps {
  textareaRef: RefObject<HTMLTextAreaElement>;
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
  textareaRef, 
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

  const updateActiveFormatsForSelection = (start: number, end: number) => {
    // Find styles that affect this selection
    const overlappingStyles = inlineStyles.filter(style => 
      (style.start <= start && style.end > start) || 
      (style.start < end && style.end >= end) ||
      (start <= style.start && end >= style.end)
    );

    if (overlappingStyles.length > 0) {
      // Get the last applied style (priority to the most recent)
      const latestStyle = overlappingStyles[overlappingStyles.length - 1];
      
      setActiveTextFormat({
        isBold: latestStyle.isBold || false,
        isItalic: latestStyle.isItalic || false,
        isUnderline: latestStyle.isUnderline || false,
        font: latestStyle.font || documentStyle.font,
        size: latestStyle.size || documentStyle.size,
        color: latestStyle.color || documentStyle.color,
        alignment: latestStyle.alignment || documentStyle.alignment,
      });
    } else {
      // Reset to document default if no styles apply
      setActiveTextFormat({
        isBold: false,
        isItalic: false,
        isUnderline: false,
        font: documentStyle.font,
        size: documentStyle.size,
        color: documentStyle.color,
        alignment: documentStyle.alignment,
      });
    }
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      if (!textareaRef.current) return;

      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      if (start !== end) {
        setSelectionRange({ start, end });
        setIsFormatToolbarOpen(true);
        
        // Check if selection has existing styles and update active format buttons
        updateActiveFormatsForSelection(start, end);
      } else {
        setSelectionRange(null);
        setIsFormatToolbarOpen(false);
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('mouseup', handleSelectionChange);
      textarea.addEventListener('keyup', handleSelectionChange);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener('mouseup', handleSelectionChange);
        textarea.removeEventListener('keyup', handleSelectionChange);
      }
    };
  }, [inlineStyles, content, textareaRef, documentStyle]);

  return {
    selectionRange,
    setSelectionRange,
    isFormatToolbarOpen,
    setIsFormatToolbarOpen,
    activeTextFormat,
    setActiveTextFormat,
    updateActiveFormatsForSelection
  };
};

export default useTextSelection;
