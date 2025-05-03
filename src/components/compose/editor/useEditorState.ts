
import { useState, useEffect } from 'react';

export function useEditorState() {
  // Toolbar state
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [isToolbarDetached, setIsToolbarDetached] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  
  // Color picker and popovers
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [paperStylePopoverOpen, setPaperStylePopoverOpen] = useState(false);
  const [stylePopoverOpen, setStylePopoverOpen] = useState(false);
  
  // Text and document statistics
  const [wordCount, setWordCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  const toggleToolbarDetached = () => {
    setIsToolbarDetached(!isToolbarDetached);
    if (isToolbarDetached) {
      setToolbarPosition({ x: 0, y: 0 });
    }
  };

  // Handle zoom change
  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.min(Math.max(50, newZoom), 200));
  };

  // Load recent colors from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentTextColors');
    if (saved) {
      try {
        const colors = JSON.parse(saved);
        if (Array.isArray(colors)) {
          setRecentColors(colors.slice(0, 3));
        }
      } catch (e) {
        console.error('Error loading recent colors:', e);
      }
    }
  }, []);

  return {
    isToolbarVisible,
    setIsToolbarVisible,
    isToolbarDetached,
    setIsToolbarDetached,
    toolbarPosition,
    setToolbarPosition,
    colorPickerOpen,
    setColorPickerOpen,
    paperStylePopoverOpen,
    setPaperStylePopoverOpen,
    stylePopoverOpen,
    setStylePopoverOpen,
    wordCount,
    setWordCount,
    pageCount,
    setPageCount,
    zoom,
    setZoom,
    recentColors,
    setRecentColors,
    toggleToolbarDetached,
    handleZoomChange
  };
}
