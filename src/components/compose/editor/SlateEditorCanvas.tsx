
/**
 * Core canvas component for the SlateJS editor
 * Handles rendering the editable content with page-snap scrolling
 */
import React, { useEffect, useRef } from 'react';
import { Editable } from 'slate-react';

interface SlateEditorCanvasProps {
  renderElement: (props: any) => JSX.Element;
  renderLeaf: (props: any) => JSX.Element;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  handlePasteWithPagination: (event: React.ClipboardEvent<HTMLDivElement>) => void;
  zoom: number;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const SlateEditorCanvas: React.FC<SlateEditorCanvasProps> = ({
  renderElement,
  renderLeaf,
  handleKeyDown,
  handlePasteWithPagination,
  zoom,
  canvasRef
}) => {
  // Reference to the editable content for direct DOM access when needed
  const editableRef = useRef<HTMLDivElement | null>(null);

  // Set up improved event handling for native selection
  useEffect(() => {
    const canvasEl = canvasRef.current;
    const editableEl = editableRef.current;
    
    if (!canvasEl || !editableEl) return;
    
    // Enable smooth scrolling into view when selection changes
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Check if selection is within the editor
        if (editableEl.contains(range.commonAncestorContainer)) {
          // Calculate if selection is visible
          const canvasRect = canvasEl.getBoundingClientRect();
          
          const isVisible = (
            rect.top >= canvasRect.top &&
            rect.bottom <= canvasRect.bottom
          );
          
          // If not fully visible, scroll it into view
          if (!isVisible) {
            const selectionMidpoint = rect.top + rect.height / 2;
            const canvasMidpoint = canvasRect.top + canvasRect.height / 2;
            
            // Determine scroll direction
            if (selectionMidpoint < canvasMidpoint) {
              // Element is above viewport - scroll up
              canvasEl.scrollBy({
                top: rect.top - canvasRect.top - 50,
                behavior: 'smooth'
              });
            } else {
              // Element is below viewport - scroll down
              canvasEl.scrollBy({
                top: rect.bottom - canvasRect.bottom + 50,
                behavior: 'smooth'
              });
            }
          }
        }
      }
    };
    
    // Attach event listener
    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [canvasRef]);
  
  return (
    <div 
      ref={canvasRef}
      className="canvas word-processor-canvas w-full overflow-auto h-[calc(100vh-200px)]"
      style={{ 
        scrollSnapType: 'y mandatory',
        position: 'relative',
      }}
    >
      <div 
        className="pages-container"
        style={{
          transform: `scale(${zoom/100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease-in-out',
          padding: '2rem 0'
        }}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={handleKeyDown}
          onPaste={handlePasteWithPagination}
          spellCheck
          className="outline-none cursor-text"
          ref={editableRef}
        />
      </div>
    </div>
  );
};

export default SlateEditorCanvas;
