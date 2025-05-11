
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

// Utility to safely get DOM node with error handling
const safeGetDOMNode = (
  editor: CustomEditor,
  node: Node,
  fallbackValue = false
): HTMLElement | null => {
  try {
    if (!ReactEditor.isReadOnly(editor)) {
      return ReactEditor.toDOMNode(editor, node);
    }
  } catch (error) {
    console.debug('DOM node access failed:', error);
  }
  return null;
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
    const domNode = safeGetDOMNode(editor, node);
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

// Safely find the best split point in a paragraph
const findSplitPoint = (text: string): number => {
  // Try to split on sentence boundaries first
  const sentenceBoundaries = [...text.matchAll(/[.!?]\s+/g)];
  if (sentenceBoundaries.length > 0) {
    const lastBoundary = sentenceBoundaries[sentenceBoundaries.length - 1];
    if (lastBoundary.index && lastBoundary.index > text.length * 0.3) {
      return lastBoundary.index + 2; // +2 to include the period and space
    }
  }
  
  // Try to split on word boundaries
  const words = text.split(/\s+/);
  if (words.length > 1) {
    // Aim for middle of paragraph to avoid tiny splits
    const midPoint = Math.floor(words.length / 2);
    let charCount = 0;
    for (let i = 0; i < midPoint; i++) {
      charCount += words[i].length + 1; // +1 for the space
    }
    return charCount;
  }
  
  // Fallback to middle of text
  return Math.floor(text.length / 2);
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
    // Get text content of the node
    const text = Node.string(node);
    if (!text.trim()) return false; // Skip empty paragraphs
    
    // Find a good split point
    const splitPoint = findSplitPoint(text);
    if (splitPoint <= 0) return false;
    
    // Split the paragraph into two parts
    const firstPart = text.substring(0, splitPoint);
    const secondPart = text.substring(splitPoint);
    
    if (!secondPart.trim()) return false; // No need to split if second part is empty
    
    // Update the current node with first part
    Transforms.delete(editor, { at: path });
    Transforms.insertNodes(editor, {
      ...node,
      children: [{ text: firstPart }]
    } as ParagraphElement, { at: path });
    
    // Create a new page node with the second part
    const newPagePath = Path.next(Path.parent(path));
    Transforms.insertNodes(editor, {
      type: 'page',
      children: [{
        type: 'paragraph',
        children: [{ text: secondPart }]
      }]
    }, { at: newPagePath });
    
    return true;
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
    let maxIterations = 10; // Prevent infinite loops
    
    // Process until no more changes are needed or max iterations reached
    while (maxIterations > 0) {
      let pageChanged = false;
      
      // Find all page nodes
      const pages = Array.from(
        Editor.nodes(editor, {
          match: n => Element.isElement(n) && isPageElement(n),
        })
      );
      
      // Process each page
      for (const [pageNode, pagePath] of pages) {
        if (!Element.isElement(pageNode)) continue;
        
        // Check each child of the page
        for (let i = 0; i < pageNode.children.length; i++) {
          const childPath = [...pagePath, i];
          
          try {
            const childNode = Node.get(editor, childPath);
            if (!Element.isElement(childNode)) continue;
            
            // Check if this node overflows
            if (doesNodeOverflow(editor, childNode, childPath, pageHeight)) {
              // For paragraph nodes, try to split intelligently
              if (childNode.type === 'paragraph') {
                if (splitParagraphAtOverflow(editor, childNode, childPath, pageHeight)) {
                  pageChanged = true;
                  changesMade = true;
                  break; // Break after making a change, we'll recheck on next iteration
                }
              }
              
              // Move the entire node to a new page if it can't be split
              const nextPagePath = Path.next(pagePath);
              
              // Create a new page if needed
              let newPageExists = false;
              try {
                Node.get(editor, nextPagePath);
                newPageExists = true;
              } catch (error) {
                // Page doesn't exist, create one
                Transforms.insertNodes(editor, {
                  type: 'page',
                  children: []
                }, { at: nextPagePath });
              }
              
              try {
                // Move the overflowing node to the new page
                Transforms.moveNodes(editor, {
                  at: childPath,
                  to: [...nextPagePath, 0],
                });
                
                pageChanged = true;
                changesMade = true;
                break; // Break after making a change
              } catch (error) {
                console.error('Error moving node to new page:', error);
              }
            }
          } catch (error) {
            console.error('Error processing child node:', error);
            continue;
          }
        }
        
        // If we made changes to this page, break the loop and continue in next iteration
        if (pageChanged) break;
      }
      
      // If no pages changed in this iteration, we're done
      if (!pageChanged) break;
      
      maxIterations--;
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
    const pages = Array.from(
      Editor.nodes(editor, {
        match: n => Element.isElement(n) && isPageElement(n),
      })
    );
    
    const totalPages = pages.length;
    
    // Update each page
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
