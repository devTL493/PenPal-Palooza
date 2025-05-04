
import { useMemo, useState } from 'react';
import { Editor } from 'slate';
import { useSelectionHandling } from './useSelectionHandling';
import { useColorHandling } from './useColorHandling';
import { usePaginationHandling } from './usePaginationHandling';
import { CustomEditor } from './types';

export function useSlateEditor(editor: CustomEditor, pageHeight: number) {
  // Popovers for additional formatting options
  const [stylePopoverOpen, setStylePopoverOpen] = useState(false);
  const [paperStylePopoverOpen, setPaperStylePopoverOpen] = useState(false);
  
  // Track typing state
  const [isTyping, setIsTyping] = useState(false);

  // Get all the necessary editor utilities
  const selectionUtils = useSelectionHandling(editor);
  const colorUtils = useColorHandling(editor);
  const paginationUtils = usePaginationHandling(editor, pageHeight);
  
  // Enhanced keyboard handler
  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Handle Ctrl+A for select all
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
      selectionUtils.handleSelectAll();
      return;
    }
    
    // Handle standard formatting shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'b': {
          event.preventDefault();
          editor.addMark('bold', true);
          break;
        }
        case 'i': {
          event.preventDefault();
          editor.addMark('italic', true);
          break;
        }
        case 'u': {
          event.preventDefault();
          editor.addMark('underline', true);
          break;
        }
      }
    }
  };

  return {
    // Selection utilities
    ...selectionUtils,
    
    // Color utilities
    ...colorUtils,
    
    // Pagination utilities
    ...paginationUtils,
    
    // Popovers state
    stylePopoverOpen,
    setStylePopoverOpen,
    paperStylePopoverOpen,
    setPaperStylePopoverOpen,
    
    // Typing state
    isTyping,
    setIsTyping,
    
    // Enhanced keyboard handler
    handleKeyDown
  };
}
