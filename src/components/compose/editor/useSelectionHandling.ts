/**
 * Hook for managing text selection in the SlateJS editor
 * Provides utilities for saving, restoring, and manipulating selection
 */
import { useCallback, useState, useRef, useEffect } from 'react';
import { Editor, Transforms, Range, Path, Point } from 'slate';
import { CustomEditor } from './types';

export function useSelectionHandling(editor: CustomEditor) {
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  // Track if we're preventing events to avoid double handling
  const preventNextSelectionChangeRef = useRef<boolean>(false);
  // Track the last valid selection for restoration
  const lastValidSelectionRef = useRef<Range | null>(null);
  
  // Save current editor selection to state
  const saveCurrentSelection = useCallback(() => {
    if (editor.selection) {
      setSavedSelection(editor.selection);
      lastValidSelectionRef.current = editor.selection;
    }
  }, [editor]);
  
  // Restore the saved selection or use last valid selection as fallback
  const restoreSelection = useCallback(() => {
    const selectionToRestore = savedSelection || lastValidSelectionRef.current;
    
    if (selectionToRestore) {
      try {
        Transforms.select(editor, selectionToRestore);
      } catch (error) {
        console.error('Failed to restore selection:', error);
        
        // If restoring fails, try selecting the start of the document
        try {
          const start = Editor.start(editor, []);
          Transforms.select(editor, { anchor: start, focus: start });
        } catch (innerError) {
          console.error('Failed to select document start:', innerError);
        }
      }
    }
  }, [editor, savedSelection]);
  
  // Watch for selection changes in the editor to keep our saved state updated
  useEffect(() => {
    // Update the last valid selection ref whenever editor selection changes
    const updateLastValidSelection = () => {
      if (editor.selection) {
        lastValidSelectionRef.current = editor.selection;
      }
    };
    
    // Set up a MutationObserver to track DOM changes that might affect selection
    let observer: MutationObserver | null = null;
    
    try {
      observer = new MutationObserver((mutations) => {
        if (!preventNextSelectionChangeRef.current && editor.selection) {
          updateLastValidSelection();
        }
      });
      
      const editorElement = document.querySelector('[data-slate-editor="true"]');
      if (editorElement) {
        observer.observe(editorElement, { 
          childList: true, 
          subtree: true, 
          characterData: true 
        });
      }
    } catch (e) {
      console.error('Error setting up selection observer:', e);
    }
    
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [editor]);
  
  // Handler for selection-preserving mouse events on formatting buttons
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only prevent default for formatting buttons to avoid disrupting native selection
    const target = e.target as HTMLElement;
    const isFormatButton = target.closest('[data-format-button]');
    const isToolbarButton = target.closest('.toolbar-button');
    
    if (isFormatButton || isToolbarButton) {
      // Save current selection before interaction
      saveCurrentSelection();
      // Only prevent default for format buttons to maintain selection
      e.preventDefault();
    }
  }, [saveCurrentSelection]);
  
  // Handle "Select All" keyboard shortcut
  const handleSelectAll = useCallback(() => {
    try {
      const start = Editor.start(editor, []);
      const end = Editor.end(editor, []);
      
      // Create a new range that spans the entire document
      const range = {
        anchor: start,
        focus: end,
      };
      
      // Apply the selection
      Transforms.select(editor, range);
      
      // Save this selection
      setSavedSelection(range);
      lastValidSelectionRef.current = range;
    } catch (error) {
      console.error('Error with select all:', error);
    }
  }, [editor]);

  return {
    savedSelection,
    setSavedSelection,
    saveCurrentSelection,
    restoreSelection,
    handleMouseDown,
    handleSelectAll,
    preventNextSelectionChange: (value: boolean) => {
      preventNextSelectionChangeRef.current = value;
    },
    isPreventingNextSelectionChange: () => preventNextSelectionChangeRef.current,
    getLastValidSelection: () => lastValidSelectionRef.current
  };
}
