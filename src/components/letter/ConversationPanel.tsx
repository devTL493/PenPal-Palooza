
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from 'lucide-react';
import ConversationHistory from '@/components/letter/ConversationHistory';
import { ComposeViewMode } from '@/components/letter/ComposeViewOption';

interface ConversationPanelProps {
  conversation: Array<{
    id: string;
    sender: {
      name: string;
      isYou?: boolean;
      avatar?: string;
    };
    content: string;
    date: string;
  }>;
  senderName: string;
  activeMessageId: string | undefined;
  onDeleteConversation: () => void;
  onScrollToQuote: (quoteId: string) => void;
  viewMode: ComposeViewMode;
  onTogglePanelPosition?: () => void;
  isWideScreen: boolean;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({
  conversation,
  senderName,
  activeMessageId,
  onDeleteConversation,
  onScrollToQuote,
  viewMode,
  onTogglePanelPosition,
  isWideScreen
}) => {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Conversation with {senderName || "Pen Pal"}</h2>
        {isWideScreen && onTogglePanelPosition && (
          <Button 
            variant="outline"
            size="sm"
            onClick={onTogglePanelPosition} // Direct function reference
            title="Switch panel positions"
          >
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Swap Panels
          </Button>
        )}
      </div>
      
      <ConversationHistory 
        conversation={conversation}
        activeMessageId={activeMessageId}
        onScrollToQuote={onScrollToQuote}
        onDeleteConversation={onDeleteConversation}
        expandable={true}
        showComposeButton={false}
        viewMode={viewMode}
      />
    </div>
  );
};

export default ConversationPanel;
