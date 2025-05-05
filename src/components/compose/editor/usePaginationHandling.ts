
/**
 * Hook for handling page break pagination in the SlateJS editor
 * Provides unified pagination logic that splits content across pages
 * based on overflow detection
 */
import { useCallback } from 'react';
import { handlePageBreaks, updatePageNumbers } from './PageBreakHandler';
import { CustomEditor } from './types';

export function usePaginationHandling(editor: CustomEditor, pageHeight: number) {
  // Perform pagination and update page numbers
  const paginateContent = useCallback(() => {
    setTimeout(() => {
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

  return {
    paginateContent,
    handlePasteWithPagination
  };
}
