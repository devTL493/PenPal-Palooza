
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ComposeViewMode } from '@/components/letter/ComposeViewOption';

export interface ComposeViewState {
  viewMode: ComposeViewMode;
  setViewMode: (mode: ComposeViewMode) => void;
  isPanelReversed: boolean;
  setIsPanelReversed: (reversed: boolean) => void;
  isWideScreen: boolean;
  setIsWideScreen: (isWide: boolean) => void;
  togglePanelPosition: () => void;
}

export const useComposeView = (): ComposeViewState => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ComposeViewMode>('side-by-side');
  const [isPanelReversed, setIsPanelReversed] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1024);
  
  // Track screen size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to switch panel positions
  const togglePanelPosition = () => {
    const newValue = !isPanelReversed;
    setIsPanelReversed(newValue);
    
    // Show toast notification with the correct state value
    toast({
      title: `Panel positions ${newValue ? "swapped" : "reset"}`,
      description: `Conversation is now on the ${newValue ? "left" : "right"}`,
    });
  };

  return {
    viewMode,
    setViewMode,
    isPanelReversed,
    setIsPanelReversed,
    isWideScreen,
    setIsWideScreen,
    togglePanelPosition
  };
};
