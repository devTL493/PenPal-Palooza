
/**
 * Hook for managing text selection in the SlateJS editor
 * Provides utilities for saving, restoring, and manipulating selection
 */
import { useCallback, useState } from 'react';
import { Editor, Transforms, Range, Path, Point } from 'slate';
import { CustomEditor } from './types';

export function useSelectionHandling(editor: CustomEditor) {
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  
  // Save the current editor selection
  const saveCurrentSelection = useCallback(() => {
    if (editor.selection) {
      setSavedSelection(editor.selection);
    }
  }, [editor]);
  
  // Restore the saved selection
  const restoreSelection = useCallback(() => {
    if (savedSelection) {
      try {
        Transforms.select(editor, savedSelection);
      } catch (error) {
        console.error('Failed to restore selection:', error);
      }
    }
  }, [editor, savedSelection]);
  
  // Handler for selection-preserving mouse events on formatting buttons
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent losing focus or selection
  }, []);
  
  // Handle "Select All" keyboard shortcut
  const handleSelectAll = useCallback(() => {
    try {
      const start = Editor.start(editor, []);
      const end = Editor.end(editor, []);
      
      Transforms.select(editor, {
        anchor: start,
        focus: end,
      });
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
    handleSelectAll
  };
}
