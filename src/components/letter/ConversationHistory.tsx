
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessagesSquare, ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import CollapsibleMessage from './CollapsibleMessage';

interface ConversationHistoryProps {
  conversation: Array<{
    id: string;
    sender: {
      name: string;
      isYou?: boolean;
    };
    content: string;
    date: string;
  }>;
  activeMessageId?: string;
  onScrollToQuote?: (quoteId: string) => void;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ 
  conversation,
  activeMessageId,
  onScrollToQuote
}) => {
  const [showConversation, setShowConversation] = useState(false);
  const conversationContainerRef = React.useRef<HTMLDivElement>(null);

  // Scroll to a specific quote ID
  const scrollToQuote = (quoteId: string) => {
    if (onScrollToQuote) {
      onScrollToQuote(quoteId);
    }
    
    if (conversationContainerRef.current) {
      const quoteElement = document.getElementById(quoteId);
      if (quoteElement) {
        setTimeout(() => {
          quoteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          quoteElement.classList.add('highlight-pulse');
          setTimeout(() => {
            quoteElement.classList.remove('highlight-pulse');
          }, 2000);
        }, 100);
      }
    }
  };

  if (!conversation || conversation.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() => setShowConversation(!showConversation)}
        className="w-full flex justify-between"
      >
        <span className="flex items-center">
          <MessagesSquare className="mr-2 h-4 w-4" />
          {showConversation ? "Hide Conversation History" : "Show Entire Conversation"}
          <Badge variant="secondary" className="ml-2">
            {conversation.length} letters
          </Badge>
        </span>
        {showConversation ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      
      {showConversation && (
        <div 
          ref={conversationContainerRef}
          className="h-[400px] overflow-y-auto border rounded-md p-4"
        >
          <div className="space-y-4">
            {conversation.map((message) => (
              <CollapsibleMessage 
                key={message.id}
                message={message}
                isActive={message.id === activeMessageId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationHistory;
