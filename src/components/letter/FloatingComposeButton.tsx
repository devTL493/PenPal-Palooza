
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool } from 'lucide-react';

interface FloatingComposeButtonProps {
  recipientId?: string;
  recipientName?: string;
  conversation?: boolean;
}

const FloatingComposeButton: React.FC<FloatingComposeButtonProps> = ({
  recipientId,
  recipientName,
  conversation = false
}) => {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  // Create URL with query parameters for recipient if provided
  const composeUrl = recipientId 
    ? `/compose?recipient=${recipientId}${recipientName ? `&name=${encodeURIComponent(recipientName)}` : ''}${conversation ? '&conversation=true' : ''}`
    : '/compose';

  // Calculate initial position based on viewport
  useEffect(() => {
    setPosition({
      x: window.innerWidth - 80,
      y: window.innerHeight - 120
    });
  }, []);

  // Handle mouse/touch down to start dragging
  const handleStart = (clientX: number, clientY: number) => {
    if (buttonRef.current) {
      setIsDragging(true);
      setStartPos({
        x: clientX - position.x,
        y: clientY - position.y
      });
    }
  };

  // Handle mouse/touch move during dragging
  const handleMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      // Confine to window boundaries
      const newX = Math.min(Math.max(0, clientX - startPos.x), window.innerWidth - (buttonRef.current?.offsetWidth || 60));
      const newY = Math.min(Math.max(0, clientY - startPos.y), window.innerHeight - (buttonRef.current?.offsetHeight || 60));
      
      setPosition({ x: newX, y: newY });
    }
  };

  // Handle mouse/touch up to end dragging
  const handleEnd = () => {
    setIsDragging(false);
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Add global listeners for dragging outside the button
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, startPos]);

  // Global event handlers
  const handleGlobalMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleGlobalMouseUp = () => {
    handleEnd();
  };

  const handleGlobalTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      // Prevent scrolling while dragging
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  };

  const handleGlobalTouchEnd = () => {
    handleEnd();
  };

  const handleClick = () => {
    // Only navigate if we weren't dragging
    if (!isDragging) {
      navigate(composeUrl);
    }
  };

  return (
    <div
      ref={buttonRef}
      className={`fixed z-50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} touch-none select-none`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging ? 'none' : 'all 0.2s ease'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <div className="bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
        <PenTool className="h-6 w-6" />
      </div>
    </div>
  );
};

export default FloatingComposeButton;
