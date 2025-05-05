
/**
 * Page break and pagination handler for SlateJS editor
 * Provides utilities for detecting overflow, splitting content across pages,
 * and updating page numbers
 */
import { Editor, Transforms, Element, Node, Path } from 'slate';
import { ReactEditor } from 'slate-react';
import { CustomEditor, ParagraphElement } from './types';
import { createHyperscript } from 'slate-hyperscript';

// Create hyperscript helper for Slate JSX creation
export const jsx = createHyperscript({
  elements: {
    paragraph: { type: 'paragraph' },
    page: { type: 'page' }
  }
});

// Utility to check if a block is a page
export const isPageElement = (element: any): boolean => {
  return element.type === 'page';
};

// Utility to check if a node overflows its container
export const doesNodeOverflow = (
  editor: CustomEditor, 
  node: Node, 
  path: Path, 
  pageHeight: number
): boolean => {
  try {
    if (!pageHeight) return false;
    
    // Get DOM node for this slate node
    const domNode = ReactEditor.toDOMNode(editor, node);
    if (!domNode) return false;
    
    // Get page element that contains this node
    const pageElement = domNode.closest('.page');
    if (!pageElement) return false;
    
    // Get usable height (accounting for margins)
    const bottomMargin = 30; // Bottom margin in pixels for page footer
    const usableHeight = pageHeight - bottomMargin;
    
    // Calculate if the node extends beyond the usable height
    const nodeRect = domNode.getBoundingClientRect();
    const pageRect = pageElement.getBoundingClientRect();
    
    // Check if bottom of node exceeds usable page height
    const relativeBottom = nodeRect.bottom - pageRect.top;
    return relativeBottom > usableHeight;
  } catch (error) {
    console.error('Error checking overflow:', error);
    return false;
  }
};

// Get the page height from CSS variables
export const getPageHeight = (): number => {
  const heightVar = getComputedStyle(document.documentElement).getPropertyValue('--page-height');
  if (!heightVar) return 792; // Default to US Letter height in pixels
  
  // Parse the CSS variable value
  let height: number;
  if (heightVar.includes('mm')) {
    height = parseFloat(heightVar) * 3.7795275591; // mm to px
  } else if (heightVar.includes('in')) {
    height = parseFloat(heightVar) * 96; // inches to px
  } else {
    height = parseFloat(heightVar);
  }
  
  return height;
};

// Split paragraph at the last fitting point
export const splitParagraphAtOverflow = (
  editor: CustomEditor,
  node: Element,
  path: Path,
  pageHeight: number
): boolean => {
  // Only operate on paragraphs
  if (node.type !== 'paragraph') return false;
  
  try {
    // Find all line breaks
    const text = Node.string(node);
    const sentences = text.split(/(?<=\. )/); // Split on periods followed by a space
    
    if (sentences.length <= 1) return false;
    
    // Find last sentence that fits
    let lastFittingSentence = 0;
    let currentText = '';
    
    for (let i = 0; i < sentences.length; i++) {
      const testText = currentText + sentences[i];
      
      // Create a temporary element to test the height
      Transforms.delete(editor, { at: path });
      Transforms.insertNodes(editor, {
        ...node,
        children: [{ text: testText }]
      } as ParagraphElement, { at: path });
      
      // Check if this node overflows
      if (doesNodeOverflow(editor, Node.get(editor, path), path, pageHeight)) {
        break;
      }
      
      currentText = testText;
      lastFittingSentence = i;
    }
    
    // If we have a split point, create two nodes
    if (lastFittingSentence < sentences.length - 1) {
      const firstPart = sentences.slice(0, lastFittingSentence + 1).join('');
      const secondPart = sentences.slice(lastFittingSentence + 1).join('');
      
      // Update the current node with first part
      Transforms.delete(editor, { at: path });
      Transforms.insertNodes(editor, {
        ...node,
        children: [{ text: firstPart }]
      } as ParagraphElement, { at: path });
      
      // Create a new page node
      const newPagePath = Path.next(Path.parent(path));
      Transforms.insertNodes(editor, {
        type: 'page',
        children: [{
          type: 'paragraph',
          children: [{ text: secondPart }]
        }]
      }, { at: newPagePath });
      
      // Move cursor to the beginning of the new paragraph
      const newParagraphPath = [...newPagePath, 0];
      Transforms.select(editor, Editor.start(editor, newParagraphPath));
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error splitting paragraph:', error);
    return false;
  }
};

// Main function to handle page breaks
export const handlePageBreaks = (editor: CustomEditor, pageHeight: number): boolean => {
  if (!pageHeight) {
    pageHeight = getPageHeight();
    if (!pageHeight) return false;
  }

  try {
    let changesMade = false;
    
    // Find all page nodes
    const pages = Editor.nodes(editor, {
      match: n => Element.isElement(n) && isPageElement(n),
    });
    
    // Process each page
    for (const [pageNode, pagePath] of pages) {
      if (!Element.isElement(pageNode)) continue;
      
      // Check each child of the page
      for (let i = 0; i < pageNode.children.length; i++) {
        const childPath = [...pagePath, i];
        const childNode = Node.get(editor, childPath);
        
        // Make sure we only work with Element nodes with children
        if (!Element.isElement(childNode)) continue;
        
        // Check if this node overflows
        if (doesNodeOverflow(editor, childNode, childPath, pageHeight)) {
          // For paragraph nodes, try to split intelligently
          if (childNode.type === 'paragraph' && splitParagraphAtOverflow(editor, childNode, childPath, pageHeight)) {
            changesMade = true;
            break; // Break after making a change, we'll recheck on next call
          } else {
            // For non-paragraph nodes, move whole node to new page
            const nextPagePath = Path.next(pagePath);
            
            // Create a new page if needed
            let newPage;
            try {
              newPage = Node.get(editor, nextPagePath);
            } catch (error) {
              // Page doesn't exist, create one
              Transforms.insertNodes(editor, {
                type: 'page',
                children: []
              }, { at: nextPagePath });
              newPage = Node.get(editor, nextPagePath);
            }
            
            // Move the overflowing node to the new page
            Transforms.moveNodes(editor, {
              at: childPath,
              to: [...nextPagePath, 0],
            });
            
            changesMade = true;
            break; // Break after making a change, we'll recheck on next call
          }
        }
      }
      
      // If we made changes, break the loop and let the next call handle remaining pages
      if (changesMade) break;
    }
    
    return changesMade;
  } catch (error) {
    console.error('Error handling page breaks:', error);
    return false;
  }
};

// Update page numbers in all page footers
export const updatePageNumbers = (editor: Editor): void => {
  try {
    // Count pages
    const pageCount = Editor.nodes(editor, {
      match: n => Element.isElement(n) && isPageElement(n),
    });
    
    let totalPages = 0;
    for (const _ of pageCount) {
      totalPages++;
    }
    
    // Update each page
    const pages = Editor.nodes(editor, {
      match: n => Element.isElement(n) && isPageElement(n),
    });
    
    let currentPage = 0;
    for (const [_, pagePath] of pages) {
      currentPage++;
      
      // Update page element with page number and count
      Transforms.setNodes(
        editor,
        { pageNumber: currentPage, pageCount: totalPages },
        { at: pagePath }
      );
    }
  } catch (error) {
    console.error('Error updating page numbers:', error);
  }
};
