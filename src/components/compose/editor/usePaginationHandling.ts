
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
  // Track pagination attempts to detect infinite loops
  const paginationAttemptsRef = useRef<number>(0);
  // Maximum allowed pagination attempts before forced cooldown
  const MAX_PAGINATION_ATTEMPTS = 5;
  // Cooldown period in milliseconds
  const PAGINATION_COOLDOWN = 2000;
  
  // Reset pagination attempts counter after cooldown period
  const resetPaginationAttempts = useCallback(() => {
    paginationAttemptsRef.current = 0;
  }, []);
  
  // Perform pagination and update page numbers with safeguards
  const paginateContent = useCallback(() => {
    // Clear any existing timeout
    if (paginationTimeoutRef.current) {
      clearTimeout(paginationTimeoutRef.current);
      paginationTimeoutRef.current = null;
    }
    
    // Prevent pagination if we're already paginating
    if (isPaginatingRef.current) {
      paginationRequestedRef.current = true;
      return;
    }
    
    // Check if we've hit the attempt limit - if so, force a cooldown
    if (paginationAttemptsRef.current >= MAX_PAGINATION_ATTEMPTS) {
      console.warn(`Pagination attempts exceeded maximum (${MAX_PAGINATION_ATTEMPTS}). Cooling down...`);
      // Set a cooldown timeout before allowing more pagination
      setTimeout(() => {
        resetPaginationAttempts();
        console.log('Pagination cooldown complete');
      }, PAGINATION_COOLDOWN);
      return;
    }
    
    // Set a new timeout for pagination with proper debouncing
    paginationTimeoutRef.current = setTimeout(() => {
      if (!editor || pageHeight <= 0) return;
      
      try {
        isPaginatingRef.current = true;
        paginationAttemptsRef.current += 1;
        
        // Only perform pagination if editor has content
        if (editor.children.length > 0) {
          // Capture document state before pagination
          const beforeState = JSON.stringify(editor.children);
          
          // Perform pagination
          const changed = handlePageBreaks(editor, pageHeight);
          if (changed) {
            updatePageNumbers(editor);
          }
          
          // Check if pagination caused no changes or is converging
          const afterState = JSON.stringify(editor.children);
          if (beforeState === afterState) {
            // If state is identical, we've reached equilibrium
            resetPaginationAttempts();
          }
        }
        
        isPaginatingRef.current = false;
        
        // If pagination was requested while we were paginating, run it again
        if (paginationRequestedRef.current) {
          paginationRequestedRef.current = false;
          // Use setTimeout to avoid exceeding call stack
          setTimeout(() => paginateContent(), 50);
        }
      } catch (error) {
        console.error('Pagination error:', error);
        isPaginatingRef.current = false;
        // Reset pagination state after error
        setTimeout(() => resetPaginationAttempts(), PAGINATION_COOLDOWN);
      }
    }, 200);
  }, [editor, pageHeight, resetPaginationAttempts]);
  
  // Handle paste event with pagination
  const handlePasteWithPagination = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    // Let's not prevent default paste behavior
    // Native browser paste handling is more reliable for formatting
    
    // Reset pagination attempts on user-initiated paste
    resetPaginationAttempts();
    
    // Schedule pagination after paste has been processed
    setTimeout(() => {
      if (!isPaginatingRef.current) {
        paginateContent();
      }
    }, 300);
  }, [paginateContent, resetPaginationAttempts]);
  
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
    isPaginating: isPaginatingRef,
    resetPaginationAttempts
  };
}
