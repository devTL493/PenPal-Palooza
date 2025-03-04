
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversationMessage {
  id: string;
  sender: {
    name: string;
    isYou?: boolean;
  };
  content: string;
  date: string;
}

interface ConversationHistoryProps {
  conversation: ConversationMessage[];
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ conversation }) => {
  const [expandedMessages, setExpandedMessages] = useState<string[]>(
    // Initially expand all messages
    conversation.map(msg => msg.id)
  );

  const toggleMessage = (id: string) => {
    setExpandedMessages(prev => 
      prev.includes(id)
        ? prev.filter(msgId => msgId !== id)
        : [...prev, id]
    );
  };

  const isExpanded = (id: string) => expandedMessages.includes(id);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium font-serif">Conversation History</h2>
      <div className="h-[700px] overflow-y-auto border rounded-md p-4">
        <div className="space-y-4">
          {conversation.map((msg) => (
            <div 
              key={msg.id}
              className={cn(
                "border rounded-md overflow-hidden",
                msg.sender.isYou ? 'bg-secondary/20 ml-4' : 'bg-muted/10 mr-4'
              )}
            >
              <div 
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-muted/5"
                onClick={() => toggleMessage(msg.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{msg.sender.name}</span>
                  <span className="text-xs text-muted-foreground">{msg.date}</span>
                </div>
                {isExpanded(msg.id) ? 
                  <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                }
              </div>
              
              {isExpanded(msg.id) && (
                <div className="p-3 pt-0">
                  <p className="whitespace-pre-line text-sm">{msg.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationHistory;
