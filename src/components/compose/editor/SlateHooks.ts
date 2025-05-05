
/**
 * Core editor hooks for the SlateJS editor
 * Provides unified selection, color handling, pagination, and keyboard shortcuts
 */
import { useState, useCallback } from 'react';
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
  
  // Handle zoom change
  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(Math.min(Math.max(50, newZoom), 200));
  }, []);
  
  // Enhanced keyboard handler with standardized shortcuts
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Handle Ctrl+A for select all
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
      const start = Editor.start(editor, []);
      const end = Editor.end(editor, []);
      Transforms.select(editor, {
        anchor: start,
        focus: end,
      });
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
  }, [editor]);

  // Prevent losing focus when interacting with popovers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

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
    
    // Zoom state and handler
    zoom,
    handleZoomChange,
    
    // Enhanced keyboard handler
    handleKeyDown,
    
    // Mouse down handler
    handleMouseDown
  };
}
