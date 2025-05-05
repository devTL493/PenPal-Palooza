
import { useState, useEffect } from 'react';
import { Position } from './types';

export function useToolbarControls() {
  // Toolbar state
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [isToolbarDetached, setIsToolbarDetached] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<Position>({ x: 0, y: 0 });
  
  // Handle toolbar visibility
  const handleMouseMove = () => {
    // Show toolbar on mouse movement if not typing
    setIsToolbarVisible(true);
  };

  // Toggle detach/attach toolbar
  const toggleToolbarDetached = () => {
    setIsToolbarDetached(!isToolbarDetached);
    if (isToolbarDetached) {
      setToolbarPosition({ x: 0, y: 0 });
    }
  };

  // Start drag operation
  const startDrag = (event: React.PointerEvent) => {
    const startX = event.clientX;
    const startY = event.clientY;
    const startLeft = toolbarPosition.x;
    const startTop = toolbarPosition.y;
    
    const handleMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      const newX = startLeft + deltaX;
      const newY = startTop + deltaY;
      
      setToolbarPosition({
        x: Math.max(0, newX),
        y: Math.max(0, newY)
      });
    };
    
    const handleUp = () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
    };
    
    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
  };

  // Escape key to show toolbar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsToolbarVisible(true);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return {
    isToolbarVisible,
    setIsToolbarVisible,
    isToolbarDetached,
    setIsToolbarDetached,
    toolbarPosition,
    setToolbarPosition,
    handleMouseMove,
    toggleToolbarDetached,
    startDrag
  };
}
