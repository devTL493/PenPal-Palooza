
/**
 * Core editor hooks for the SlateJS editor
 * Provides unified selection, color handling, pagination, and keyboard shortcuts
 */
import { useState, useCallback, useEffect } from 'react';
import { Editor, Transforms } from 'slate';
import { useSelectionHandling } from './useSelectionHandling';
import { useColorHandling } from './useColorHandling';
import { usePaginationHandling } from './usePaginationHandling';
import { CustomEditor } from './types';

export function useSlateEditor(editor: CustomEditor, pageHeight: number) {
  // Popovers for formatting options
  const [stylePopoverOpen, setStylePopoverOpen] = useState(false);
  const [paperStylePopoverOpen, setPaperStylePopoverOpen] = useState(false);
  
  // Zoom state
  const [zoom, setZoom] = useState(100);

  // Get all the necessary editor utilities
  const selectionUtils = useSelectionHandling(editor);
  const colorUtils = useColorHandling(editor);
  const paginationUtils = usePaginationHandling(editor, pageHeight);
  
  // Track if the user is selecting text (to avoid pagination during selection)
  const [isSelecting, setIsSelecting] = useState(false);
  
  // Handle zoom change with constraint validation
  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(Math.min(Math.max(50, newZoom), 200));
  }, []);
  
  // Enhanced keyboard handler with native shortcuts support
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // NEVER prevent default for native keyboard shortcuts
    // This ensures native browser functionality works correctly
    
    // Handle select all - don't interfere
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      return; // Let browser handle select all
    }
    
    // Never prevent clipboard operations
    if ((event.ctrlKey || event.metaKey) && ['c', 'v', 'x'].includes(event.key)) {
      return; // Let browser handle clipboard
    }
    
    // Handle formatting shortcuts only (and allow browser defaults)
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
  }, [editor]);

  // Prevent losing focus when interacting with popovers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    selectionUtils.handleMouseDown(e);
  }, [selectionUtils]);
  
  // Enhanced paste handler to prevent content duplication
  const handlePasteWithPagination = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    // Let the native paste happen, but schedule pagination afterward
    paginationUtils.handlePasteWithPagination(event);
    
    // Reset any selection state after paste
    setTimeout(() => {
      setIsSelecting(false);
    }, 100);
  }, [paginationUtils]);
  
  // Setup document event listeners for better cross-component coordination
  useEffect(() => {
    // Track mouse events to detect selection in progress
    const handleMouseDown = () => {
      setIsSelecting(true);
    };
    
    const handleMouseUp = () => {
      setTimeout(() => {
        setIsSelecting(false);
      }, 100);
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return {
    // Selection utilities
    ...selectionUtils,
    
    // Color utilities
    ...colorUtils,
    
    // Pagination utilities
    ...paginationUtils,
    
    // Selection state
    isSelecting,
    setIsSelecting,
    
    // Popovers state
    stylePopoverOpen,
    setStylePopoverOpen,
    paperStylePopoverOpen,
    setPaperStylePopoverOpen,
    
    // Zoom state and handler
    zoom,
    handleZoomChange,
    
    // Enhanced keyboard handler
    handleKeyDown,
    
    // Enhanced paste handler
    handlePasteWithPagination,
    
    // Mouse down handler
    handleMouseDown
  };
}
