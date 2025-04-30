
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from 'lucide-react';
import ComposeMainContent from './ComposeMainContent';
import ConversationHistory from '../letter/ConversationHistory';
import { ComposeViewMode } from '@/components/letter/ComposeViewOption';
import { ConversationMessage } from '@/types/letter';

interface ComposeMobileLayoutProps {
  viewMode: ComposeViewMode;
  renderComposerPanel: () => JSX.Element;
  conversation: ConversationMessage[];
  shouldShowConversation: boolean;
  togglePanelPosition: () => void;
}

const ComposeMobileLayout: React.FC<ComposeMobileLayoutProps> = ({
  viewMode,
  renderComposerPanel,
  conversation,
  shouldShowConversation,
  togglePanelPosition
}) => {
  return (
    <div className="space-y-6">
      <div className={`${viewMode === 'overlay' && shouldShowConversation ? 'relative' : ''}`}>
        {/* Conversation History (Overlay mode) */}
        {shouldShowConversation && (viewMode === 'overlay') && (
          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
            <ConversationHistory 
              conversation={conversation}
              viewMode={viewMode}
              showComposeButton={false}
              expandable={false}
            />
          </div>
        )}
        
        {/* Letter Compose Area */}
        <div className={viewMode === 'overlay' ? 'relative z-10' : ''}>
          {renderComposerPanel()}
        </div>
      </div>
      
      {/* Display conversation messages in side-by-side mode (mobile) */}
      {shouldShowConversation && viewMode === 'side-by-side' && (
        <div className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Conversation History</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={togglePanelPosition}
              title="Switch to conversation view first"
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Swap View</span>
            </Button>
          </div>
          <div className="border rounded-md p-4">
            <ConversationHistory 
              conversation={conversation}
              showComposeButton={false}
              expandable={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComposeMobileLayout;
