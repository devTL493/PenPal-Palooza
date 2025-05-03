
import React from 'react';

interface EditorFooterProps {
  wordCount: number;
  pageCount: number;
  zoom: number;
  handleZoomChange: (newZoom: number) => void;
}

const EditorFooter: React.FC<EditorFooterProps> = ({
  wordCount,
  pageCount,
  zoom,
  handleZoomChange
}) => {
  return (
    <>
      {/* Footer status bar */}
      <div className="mt-4 w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div>
          <span>{wordCount} words</span>
          <span className="mx-2">•</span>
          <span>{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span>Zoom:</span>
          <button 
            className="px-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => handleZoomChange(zoom - 10)}
            disabled={zoom <= 50}
          >
            -
          </button>
          <span>{zoom}%</span>
          <button 
            className="px-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => handleZoomChange(zoom + 10)}
            disabled={zoom >= 200}
          >
            +
          </button>
        </div>
      </div>
      
      {/* Keyboard shortcuts info */}
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        <p>Press <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">Ctrl+B</kbd> for bold • <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">Ctrl+I</kbd> for italic • <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">Ctrl+U</kbd> for underline • <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">ESC</kbd> to toggle toolbar</p>
      </div>
    </>
  );
};

export default EditorFooter;
