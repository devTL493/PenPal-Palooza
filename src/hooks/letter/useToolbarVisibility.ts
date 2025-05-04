
import { useState } from 'react';

export function useToolbarVisibility() {
  // Auto-hide toolbar state
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [lastTypingTime, setLastTypingTime] = useState(0);
  
  // Toolbar visibility management based on typing
  const handleContentChange = () => {
    setIsTyping(true);
    setLastTypingTime(Date.now());
    setIsToolbarVisible(false); // Hide toolbar when typing
    
    // Setup a timer to show toolbar again after user stops typing for 2 seconds
    const typingTimeout = setTimeout(() => {
      if (Date.now() - lastTypingTime > 1900) { // Check if no typing for ~2 seconds
        setIsTyping(false);
      }
    }, 2000);
    
    return () => clearTimeout(typingTimeout);
  };
  
  // Show toolbar on mouse movement
  const handleMouseMove = () => {
    if (!isTyping) {
      setIsToolbarVisible(true);
    }
  };
  
  return {
    isToolbarVisible,
    setIsToolbarVisible,
    isTyping,
    setIsTyping,
    lastTypingTime,
    setLastTypingTime,
    handleContentChange,
    handleMouseMove
  };
}
