
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MonitorIcon, SmartphoneIcon, ArrowLeftRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ComposeViewOption, { ComposeViewMode } from '@/components/letter/ComposeViewOption';

interface ComposeHeaderProps {
  recipientName: string | undefined;
  isInConversationContext: boolean;
  conversation: any[];
  isWideScreen: boolean;
  viewMode: ComposeViewMode;
  setViewMode: (mode: ComposeViewMode) => void;
  setIsWideScreen: (isWide: boolean) => void;
  togglePanelPosition: () => void;
  isPanelReversed: boolean;
  recipient: string;
}

const ComposeHeader: React.FC<ComposeHeaderProps> = ({
  recipientName,
  isInConversationContext,
  conversation,
  isWideScreen,
  viewMode,
  setViewMode,
  setIsWideScreen,
  togglePanelPosition,
  isPanelReversed,
  recipient
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-serif font-medium">
          {isInConversationContext 
            ? `Correspondence with ${recipientName || "Pen Pal"}` 
            : "Compose Letter"}
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        {conversation.length > 0 && (
          <>
            <ComposeViewOption
              currentMode={viewMode}
              onModeChange={setViewMode}
              recipientId={recipient}
            />
            
            {/* Swap panels button (desktop only) */}
            {isWideScreen && viewMode === 'side-by-side' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={togglePanelPosition}
                title="Switch panel positions"
              >
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Swap Panels</span>
              </Button>
            )}
          </>
        )}
        
        {/* Toggle for the responsive view */}
        <div className="flex border rounded-md overflow-hidden">
          <Button
            variant={isWideScreen ? "default" : "outline"}
            size="sm"
            className="rounded-none"
            onClick={() => setIsWideScreen(true)}
          >
            <MonitorIcon className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Desktop</span>
          </Button>
          <Button
            variant={!isWideScreen ? "default" : "outline"}
            size="sm"
            className="rounded-none"
            onClick={() => setIsWideScreen(false)}
          >
            <SmartphoneIcon className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Mobile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComposeHeader;
