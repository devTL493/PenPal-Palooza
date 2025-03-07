
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid, 
  Maximize,
  ExternalLink,
} from 'lucide-react';

export type ComposeViewMode = 'overlay' | 'side-by-side' | 'new-tab';

interface ComposeViewOptionProps {
  currentMode: ComposeViewMode;
  onModeChange: (mode: ComposeViewMode) => void;
  recipientId?: string;
}

const ComposeViewOption: React.FC<ComposeViewOptionProps> = ({ 
  currentMode, 
  onModeChange,
  recipientId 
}) => {
  const navigate = useNavigate();

  const handleNewTabClick = () => {
    // Get the current URL
    const currentUrl = window.location.href;
    
    // Open the compose page in a new tab
    window.open(currentUrl, '_blank');
    
    // Navigate to conversation history page if we have a recipient ID
    if (recipientId) {
      navigate(`/conversation/${recipientId}`);
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-muted/30 p-1 rounded-md">
      <Button
        size="sm"
        variant={currentMode === 'overlay' ? 'default' : 'ghost'}
        onClick={() => onModeChange('overlay')}
        className="flex-1"
        title="Hover draft over conversation"
      >
        <Maximize className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Overlay</span>
      </Button>
      
      <Button
        size="sm"
        variant={currentMode === 'side-by-side' ? 'default' : 'ghost'}
        onClick={() => onModeChange('side-by-side')}
        className="flex-1"
        title="Show draft and conversation side by side"
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Side by Side</span>
      </Button>
      
      <Button
        size="sm"
        variant={currentMode === 'new-tab' ? 'default' : 'ghost'}
        onClick={handleNewTabClick}
        className="flex-1"
        title="Open compose in new tab"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">New Tab</span>
      </Button>
    </div>
  );
};

export default ComposeViewOption;
