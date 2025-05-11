
/**
 * Hook for handling page break pagination in the SlateJS editor
 * Provides unified pagination logic that splits content across pages
 * based on overflow detection
 */
import { useCallback, useEffect } from 'react';
import { handlePageBreaks, updatePageNumbers } from './PageBreakHandler';
import { CustomEditor } from './types';

export function usePaginationHandling(editor: CustomEditor, pageHeight: number) {
  // Debounced pagination to avoid performance issues during typing
  let paginationTimeout: NodeJS.Timeout | null = null;
  
  // Perform pagination and update page numbers
  const paginateContent = useCallback(() => {
    // Clear any existing timeout to prevent multiple pagination calls
    if (paginationTimeout) {
      clearTimeout(paginationTimeout);
    }
    
    // Set a new timeout for pagination
    paginationTimeout = setTimeout(() => {
      if (editor) {
        const changed = handlePageBreaks(editor, pageHeight);
        if (changed) {
          updatePageNumbers(editor);
        }
      }
    }, 100);
  }, [editor, pageHeight]);
  
  // Handle paste event with pagination
  const handlePasteWithPagination = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    // Allow native paste behavior
    // Pagination will run after paste is processed
    setTimeout(() => {
      paginateContent();
    }, 200);
  }, [paginateContent]);
  
  // Set up pagination on editor changes
  useEffect(() => {
    // Set up the editor to paginate after content changes
    if (editor) {
      const { onChange } = editor;
      editor.onChange = () => {
        onChange();
        
        // Debounce the pagination to avoid excessive calculations
        if (paginationTimeout) {
          clearTimeout(paginationTimeout);
        }
        
        paginationTimeout = setTimeout(() => {
          const changed = handlePageBreaks(editor, pageHeight);
          if (changed) {
            updatePageNumbers(editor);
          }
        }, 300);
      };
    }
    
    return () => {
      // Clean up timeout on unmount
      if (paginationTimeout) {
        clearTimeout(paginationTimeout);
      }
    };
  }, [editor, pageHeight]);

  return {
    paginateContent,
    handlePasteWithPagination
  };
}
