
/**
 * Hook for handling page break pagination in the SlateJS editor
 * Provides unified pagination logic that splits content across pages
 * based on overflow detection
 */
import { useCallback, useEffect, useRef } from 'react';
import { handlePageBreaks, updatePageNumbers } from './PageBreakHandler';
import { CustomEditor } from './types';

export function usePaginationHandling(editor: CustomEditor, pageHeight: number) {
  // Use ref for timeout to properly clear it
  const paginationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Track if we're currently paginating to prevent recursive calls
  const isPaginatingRef = useRef<boolean>(false);
  // Track if pagination is requested while another is in progress
  const paginationRequestedRef = useRef<boolean>(false);
  
  // Perform pagination and update page numbers
  const paginateContent = useCallback(() => {
    // Prevent initiating pagination if we're already paginating
    if (isPaginatingRef.current) {
      paginationRequestedRef.current = true;
      return;
    }
    
    // Clear any existing timeout to prevent multiple pagination calls
    if (paginationTimeoutRef.current) {
      clearTimeout(paginationTimeoutRef.current);
      paginationTimeoutRef.current = null;
    }
    
    // Set a new timeout for pagination with proper debouncing
    paginationTimeoutRef.current = setTimeout(() => {
      if (editor && pageHeight > 0) {
        try {
          isPaginatingRef.current = true;
          
          // Only perform pagination if editor has content
          if (editor.children.length > 0) {
            const changed = handlePageBreaks(editor, pageHeight);
            if (changed) {
              updatePageNumbers(editor);
            }
          }
          
          isPaginatingRef.current = false;
          
          // If pagination was requested while we were paginating, run it again
          if (paginationRequestedRef.current) {
            paginationRequestedRef.current = false;
            paginateContent();
          }
        } catch (error) {
          console.error('Pagination error:', error);
          isPaginatingRef.current = false;
        }
      }
    }, 200);
  }, [editor, pageHeight]);
  
  // Handle paste event with pagination
  const handlePasteWithPagination = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    // Allow native paste behavior
    // Pagination will run after paste is processed
    setTimeout(() => {
      if (!isPaginatingRef.current) {
        paginateContent();
      }
    }, 300);
  }, [paginateContent]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (paginationTimeoutRef.current) {
        clearTimeout(paginationTimeoutRef.current);
      }
    };
  }, []);

  return {
    paginateContent,
    handlePasteWithPagination,
    isPaginating: isPaginatingRef
  };
}
