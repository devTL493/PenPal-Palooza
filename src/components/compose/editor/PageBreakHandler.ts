
import { Editor, Transforms, Element, Node, Path, Range, Point } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
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

// Convert HTML text to Slate nodes
export const deserializeHTML = (html: string): Node[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Function to convert DOM node to Slate node
  const convertDOMNodeToSlate = (domNode: globalThis.Node): any => {
    if (domNode.nodeType === 3) { // Text node
      return { text: domNode.textContent || '' };
    } else if (domNode.nodeType !== 1) { // Not an element
      return null;
    }
    
    const element = domNode as HTMLElement;
    const tagName = element.tagName.toLowerCase();
    
    // Handle different HTML tags
    if (tagName === 'p') {
      // Create paragraph with children
      const children = Array.from(element.childNodes)
        .map(convertDOMNodeToSlate)
        .filter(Boolean);
      
      return {
        type: 'paragraph',
        children: children.length ? children : [{ text: '' }]
      };
    } else if (['b', 'strong'].includes(tagName)) {
      // Bold text
      return {
        text: element.textContent || '',
        bold: true
      };
    } else if (['i', 'em'].includes(tagName)) {
      // Italic text
      return {
        text: element.textContent || '',
        italic: true
      };
    } else if (tagName === 'u') {
      // Underline text
      return {
        text: element.textContent || '',
        underline: true
      };
    } else if (tagName === 'span') {
      // Handle span with style attributes
      const style = element.getAttribute('style') || '';
      const colorMatch = style.match(/color:\s*([^;]+)/i);
      
      if (colorMatch) {
        return {
          text: element.textContent || '',
          color: colorMatch[1]
        };
      }
      
      return { text: element.textContent || '' };
    } else if (tagName === 'div' || tagName === 'body') {
      // Flatten divs into paragraphs
      const paragraphs: any[] = [];
      let currentTextNodes: any[] = [];
      
      Array.from(element.childNodes).forEach(child => {
        const converted = convertDOMNodeToSlate(child as globalThis.Node);
        
        if (converted) {
          if (Array.isArray(converted)) {
            // Flatten array
            converted.forEach(item => {
              if (item.type === 'paragraph') {
                // If we have accumulated text nodes, create a paragraph
                if (currentTextNodes.length > 0) {
                  paragraphs.push({
                    type: 'paragraph',
                    children: currentTextNodes
                  });
                  currentTextNodes = [];
                }
                paragraphs.push(item);
              } else {
                currentTextNodes.push(item);
              }
            });
          } else if (converted.type === 'paragraph') {
            // If we have accumulated text nodes, create a paragraph
            if (currentTextNodes.length > 0) {
              paragraphs.push({
                type: 'paragraph',
                children: currentTextNodes
              });
              currentTextNodes = [];
            }
            paragraphs.push(converted);
          } else {
            currentTextNodes.push(converted);
          }
        }
      });
      
      // Handle any remaining text nodes
      if (currentTextNodes.length > 0) {
        paragraphs.push({
          type: 'paragraph',
          children: currentTextNodes
        });
      }
      
      return paragraphs.length ? paragraphs : [{ type: 'paragraph', children: [{ text: '' }] }];
    }
    
    // Default to returning the text content
    return { text: element.textContent || '' };
  };
  
  // Start conversion from body
  const result = convertDOMNodeToSlate(doc.body);
  
  // Ensure we return an array of nodes
  return Array.isArray(result) ? result : [result];
};

// Custom paste handler
export const handlePaste = (
  event: React.ClipboardEvent<HTMLDivElement>,
  editor: CustomEditor
) => {
  event.preventDefault();
  
  // Get HTML content from clipboard
  const html = event.clipboardData.getData('text/html');
  const text = event.clipboardData.getData('text/plain');
  
  let content;
  if (html) {
    // If HTML is available, parse it to Slate nodes
    content = deserializeHTML(html);
  } else if (text) {
    // If only plain text is available, convert to paragraphs
    content = text
      .split('\n')
      .map(line => ({
        type: 'paragraph',
        children: [{ text: line }]
      }));
  } else {
    // Nothing to paste
    return;
  }
  
  // Insert at the current selection
  if (editor.selection) {
    Transforms.insertNodes(editor, content as Node[]);
    
    // Run pagination after paste
    setTimeout(() => {
      handlePageBreaks(editor, getPageHeight());
      updatePageNumbers(editor);
    }, 0);
  }
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
      
      // The footer is displayed using CSS, not as an actual node in the editor
      // We'll update a data attribute on the page element
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

// Handle the Ctrl+A keyboard shortcut to select all text
export const handleSelectAll = (event: React.KeyboardEvent, editor: CustomEditor) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
    event.preventDefault();
    
    // Select all content across all pages
    const start = Editor.start(editor, []);
    const end = Editor.end(editor, []);
    
    const range = { anchor: start, focus: end };
    Transforms.select(editor, range);
  }
};
