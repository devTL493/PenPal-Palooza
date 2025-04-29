
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

interface SplitPanelLayoutProps {
  composerPanel: React.ReactNode;
  conversationPanel: React.ReactNode;
  isReversed: boolean;
  onToggleLayout: () => void;
}

const SplitPanelLayout: React.FC<SplitPanelLayoutProps> = ({
  composerPanel,
  conversationPanel,
  isReversed,
  onToggleLayout,
}) => {
  return (
    <div className="relative h-[calc(100vh-120px)]">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-full rounded-lg border"
      >
        <ResizablePanel defaultSize={40} minSize={30} maxSize={70}>
          {isReversed ? conversationPanel : composerPanel}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={30} maxSize={70}>
          {isReversed ? composerPanel : conversationPanel}
        </ResizablePanel>
      </ResizablePanelGroup>
      
      <Button 
        variant="outline" 
        size="icon"
        className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-background shadow"
        onClick={onToggleLayout}
        title="Switch panel positions"
      >
        {isReversed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default SplitPanelLayout;
