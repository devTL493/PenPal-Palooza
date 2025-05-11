
/**
 * Core canvas component for the SlateJS editor
 * Handles rendering the editable content with page-snap scrolling
 */
import React from 'react';
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
        />
      </div>
    </div>
  );
};

export default SlateEditorCanvas;
