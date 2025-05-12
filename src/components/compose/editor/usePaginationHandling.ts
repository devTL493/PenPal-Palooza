
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
  const MAX_PAGINATION_ATTEMPTS = 3; // Reduced from 5 to limit cascade effect
  // Cooldown period in milliseconds
  const PAGINATION_COOLDOWN = 2000;
  // Last change timestamp to detect rapid changes
  const lastChangeTimestampRef = useRef<number>(0);
  // Minimum time between pagination attempts
  const MIN_PAGINATION_INTERVAL = 500;
  
  // Reset pagination attempts counter after cooldown period
  const resetPaginationAttempts = useCallback(() => {
    paginationAttemptsRef.current = 0;
  }, []);
  
  // Perform pagination and update page numbers with safeguards
  const paginateContent = useCallback(() => {
    // Check if we should throttle pagination based on time elapsed
    const now = Date.now();
    const timeSinceLastChange = now - lastChangeTimestampRef.current;
    
    if (timeSinceLastChange < MIN_PAGINATION_INTERVAL) {
      // Too soon after last change, wait a bit
      if (paginationTimeoutRef.current) {
        clearTimeout(paginationTimeoutRef.current);
      }
      
      paginationTimeoutRef.current = setTimeout(() => {
        paginateContent();
      }, MIN_PAGINATION_INTERVAL);
      return;
    }
    
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
    
    // Update last change timestamp
    lastChangeTimestampRef.current = now;
    
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
        // but with a delay to prevent tight loops
        if (paginationRequestedRef.current) {
          paginationRequestedRef.current = false;
          // Use setTimeout to avoid exceeding call stack
          setTimeout(() => paginateContent(), 200); // Increased delay
        }
      } catch (error) {
        console.error('Pagination error:', error);
        isPaginatingRef.current = false;
        // Reset pagination state after error
        setTimeout(() => resetPaginationAttempts(), PAGINATION_COOLDOWN);
      }
    }, 300); // Increased from 200ms to 300ms for more debouncing
  }, [editor, pageHeight, resetPaginationAttempts]);
  
  // Handle paste event with pagination
  const handlePasteWithPagination = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    // Reset pagination attempts on user-initiated paste
    resetPaginationAttempts();
    
    // Schedule pagination after paste has been processed
    // but with a longer delay to ensure content is fully inserted
    setTimeout(() => {
      if (!isPaginatingRef.current) {
        paginateContent();
      }
    }, 500); // Increased from 300ms to 500ms
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
