
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export interface PanelConfig {
  defaultSize: number;
  minSize?: number;
  maxSize?: number;
}

export interface SplitPanelLayoutProps {
  leftPanel: {
    content: React.ReactNode;
    config?: PanelConfig;
  };
  rightPanel: {
    content: React.ReactNode;
    config?: PanelConfig;
  };
  isReversed?: boolean;
  onToggleLayout?: () => void;
  toggleButtonPosition?: 'top' | 'bottom' | 'center';
  className?: string;
}

/**
 * A flexible split panel layout component with resizable panels
 */
const SplitPanelLayout: React.FC<SplitPanelLayoutProps> = ({
  leftPanel,
  rightPanel,
  isReversed = false,
  onToggleLayout,
  toggleButtonPosition = 'top',
  className = '',
}) => {
  // Determine which content goes in which panel based on isReversed
  const firstPanelContent = isReversed ? rightPanel.content : leftPanel.content;
  const secondPanelContent = isReversed ? leftPanel.content : rightPanel.content;
  
  // Default panel configurations
  const firstPanelConfig = isReversed ? rightPanel.config : leftPanel.config;
  const secondPanelConfig = isReversed ? leftPanel.config : rightPanel.config;
  
  // Position the toggle button based on the provided position
  const getToggleButtonPosition = () => {
    switch (toggleButtonPosition) {
      case 'top':
        return 'top-4';
      case 'bottom':
        return 'bottom-4';
      case 'center':
      default:
        return 'top-1/2 -translate-y-1/2';
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-full rounded-lg border"
      >
        <ResizablePanel 
          defaultSize={firstPanelConfig?.defaultSize || 40} 
          minSize={firstPanelConfig?.minSize || 30} 
          maxSize={firstPanelConfig?.maxSize || 70}
        >
          {firstPanelContent}
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel 
          defaultSize={secondPanelConfig?.defaultSize || 60} 
          minSize={secondPanelConfig?.minSize || 30} 
          maxSize={secondPanelConfig?.maxSize || 70}
        >
          {secondPanelContent}
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {onToggleLayout && (
        <Button 
          variant="outline" 
          size="icon"
          className={`absolute left-1/2 -translate-x-1/2 z-10 bg-background shadow ${getToggleButtonPosition()}`}
          onClick={onToggleLayout}
          title="Switch panel positions"
        >
          {isReversed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
};

export default SplitPanelLayout;
