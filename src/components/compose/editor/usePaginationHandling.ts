
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
    // Do not prevent the default paste behavior
    // Let Slate handle the paste natively
    
    // Run pagination after the paste is processed
    setTimeout(() => {
      paginateContent();
    }, 200);
  }, [paginateContent]);

  return {
    paginateContent,
    handlePasteWithPagination
  };
}
