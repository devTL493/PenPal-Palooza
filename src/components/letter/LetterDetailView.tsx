
import React from 'react';
import SplitPanelLayout from '@/components/letter/SplitPanelLayout';
import LetterPanel from '@/components/letter/LetterPanel';
import ConversationPanel from '@/components/letter/ConversationPanel';
import { ComposeViewMode } from '@/components/letter/ComposeViewOption';
import ConversationHistory from '@/components/letter/ConversationHistory';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LetterDetailViewProps {
  letter: {
    id: string;
    sender: {
      id?: string;
      name: string;
      avatar?: string;
    };
    preview: string;
    content: string;
    timestamp?: string;
    date?: string;
    hasAttachments?: boolean;
  };
  conversation: Array<{
    id: string;
    sender: {
      name: string;
      isYou?: boolean;
      avatar?: string;
    };
    content: string;
    date: string;
  }> | null;
  isFavorite: boolean;
  toggleFavorite: () => void;
  onScrollToQuote: (quoteId: string) => void;
  onDeleteConversation: () => void;
  viewMode: ComposeViewMode;
  isWideScreen: boolean;
  isPanelReversed: boolean;
  togglePanelPosition: () => void;
}

const LetterDetailView: React.FC<LetterDetailViewProps> = ({
  letter,
  conversation,
  isFavorite,
  toggleFavorite,
  onScrollToQuote,
  onDeleteConversation,
  viewMode,
  isWideScreen,
  isPanelReversed,
  togglePanelPosition
}) => {
  const shouldShowConversation = conversation && conversation.length > 0;
  
  // Render the letter content panel
  const renderLetterPanel = () => (
    <LetterPanel 
      letter={letter}
      isFavorite={isFavorite}
      toggleFavorite={toggleFavorite}
    />
  );

  // Render the conversation panel
  const renderConversationPanel = () => (
    <ConversationPanel 
      conversation={conversation || []}
      senderName={letter.sender.name}
      activeMessageId={letter.id}
      onDeleteConversation={onDeleteConversation}
      onScrollToQuote={onScrollToQuote}
      viewMode={viewMode}
      onTogglePanelPosition={togglePanelPosition}
      isWideScreen={isWideScreen}
    />
  );

  // Split panel layout for wide screens with conversation
  if (isWideScreen && shouldShowConversation && viewMode === 'side-by-side') {
    return (
      <SplitPanelLayout
        leftPanel={{
          content: isPanelReversed ? renderConversationPanel() : renderLetterPanel(),
          config: { defaultSize: isPanelReversed ? 30 : 70, minSize: 25, maxSize: 75 }
        }}
        rightPanel={{
          content: isPanelReversed ? renderLetterPanel() : renderConversationPanel(),
          config: { defaultSize: isPanelReversed ? 70 : 30, minSize: 25, maxSize: 75 }
        }}
        isReversed={isPanelReversed}
        onToggleLayout={togglePanelPosition}
        className="h-[calc(100vh-160px)]"
        toggleButtonPosition="center"
      />
    );
  }
  
  // Mobile or overlay layout
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className={`lg:col-span-3 space-y-6 ${viewMode === 'overlay' && shouldShowConversation ? 'relative' : ''}`}>
        {/* Conversation History overlay */}
        {shouldShowConversation && viewMode === 'overlay' && (
          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
            <ConversationHistory 
              conversation={conversation}
              viewMode={viewMode}
              showComposeButton={false}
              expandable={false}
            />
          </div>
        )}
        
        {/* Letter Content */}
        <div className={viewMode === 'overlay' ? 'relative z-10' : ''}>
          {renderLetterPanel()}
        </div>
      </div>
      
      {/* Conversation panel for mobile */}
      {shouldShowConversation && (!isWideScreen || viewMode !== 'side-by-side') && (
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            {!isWideScreen && (
              <Button 
                variant="outline"
                size="sm"
                onClick={togglePanelPosition}
                title="Switch panel positions"
              >
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Swap Panels
              </Button>
            )}
          </div>
          {renderConversationPanel()}
        </div>
      )}
    </div>
  );
};

export default LetterDetailView;
