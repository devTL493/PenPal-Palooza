
import { useState, useEffect } from 'react';
import { Editor, Transforms, Element as SlateElement } from 'slate';
import { CustomEditor } from './types';

interface UseTextFormatControlsProps {
  editor: CustomEditor;
}

export function useTextFormatControls({ editor }: UseTextFormatControlsProps) {
  // Track active formatting
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({
    bold: false,
    italic: false,
    underline: false
  });

  // Track text style properties
  const [textStyles, setTextStyles] = useState({
    fontFamily: 'serif',
    fontSize: '16px',
    lineSpacing: '1.15',
    alignment: 'left' as 'left' | 'center' | 'right' | 'justify'
  });

  // Handle format toggling from the toolbar
  const handleFormatToggle = (format: string) => {
    if (activeFormats[format]) {
      editor.removeMark(format);
    } else {
      editor.addMark(format, true);
    }
    
    // Update the active formats state
    setActiveFormats(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };

  // Text style handlers
  const handleFontFamilyChange = (value: string) => {
    editor.addMark('fontFamily', value);
    setTextStyles(prev => ({ ...prev, fontFamily: value }));
  };

  const handleFontSizeChange = (value: string) => {
    editor.addMark('fontSize', value);
    setTextStyles(prev => ({ ...prev, fontSize: value }));
  };

  const handleLineSpacingChange = (value: string) => {
    editor.addMark('lineHeight', value);
    setTextStyles(prev => ({ ...prev, lineSpacing: value }));
  };

  const handleAlignmentChange = (value: 'left' | 'center' | 'right' | 'justify') => {
    Transforms.setNodes(
      editor,
      { align: value },
      { match: n => SlateElement.isElement(n) && n.type === 'paragraph' }
    );
    setTextStyles(prev => ({ ...prev, alignment: value }));
  };

  // Update active formats when selection changes
  useEffect(() => {
    const updateActiveFormats = () => {
      const marks = editor.marks || {};
      setActiveFormats({
        bold: !!marks.bold,
        italic: !!marks.italic,
        underline: !!marks.underline
      });
      
      // Also update text styles
      if (marks.fontFamily) {
        setTextStyles(prev => ({ ...prev, fontFamily: marks.fontFamily as string }));
      }
      if (marks.fontSize) {
        setTextStyles(prev => ({ ...prev, fontSize: marks.fontSize as string }));
      }
      if (marks.lineHeight) {
        setTextStyles(prev => ({ ...prev, lineSpacing: marks.lineHeight as string }));
      }
      
      // For alignment, we need to look at the current selection's paragraph
      try {
        const [match] = Editor.nodes(editor, {
          match: n => SlateElement.isElement(n) && n.type === 'paragraph',
        });
        
        if (match) {
          const [node] = match;
          if ('align' in node) {
            const alignment = node.align as 'left' | 'center' | 'right' | 'justify' || 'left';
            setTextStyles(prev => ({ ...prev, alignment }));
          }
        }
      } catch (err) {
        console.log('No selection or paragraph found');
      }
    };

    // Set up an interval to check for selection changes
    const interval = setInterval(updateActiveFormats, 100);
    return () => clearInterval(interval);
  }, [editor]);

  return {
    activeFormats,
    textStyles,
    handleFormatToggle,
    handleFontFamilyChange,
    handleFontSizeChange,
    handleLineSpacingChange,
    handleAlignmentChange
  };
}
