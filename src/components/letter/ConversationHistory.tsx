import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  MessagesSquare, 
  Trash, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import CollapsibleMessage from './CollapsibleMessage';
import ComposeLetterButton from './ComposeLetterButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from 'react-router-dom';

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
  onDeleteConversation?: () => void;
  viewMode?: 'side-by-side' | 'overlay' | 'new-tab';
  showComposeButton?: boolean;
  expandable?: boolean;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ 
  conversation,
  activeMessageId,
  onScrollToQuote,
  onDeleteConversation,
  viewMode = 'overlay',
  showComposeButton = true,
  expandable = false
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const conversationContainerRef = React.useRef<HTMLDivElement>(null);
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({});

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

  const confirmDelete = () => {
    if (onDeleteConversation) {
      onDeleteConversation();
    }
    setShowDeleteDialog(false);
  };

  const toggleMessageExpand = (messageId: string) => {
    setExpandedMessages(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  if (!conversation || conversation.length === 0) {
    return null;
  }

  // Find the last message from the other person (not you)
  const lastSender = conversation
    .filter(msg => !msg.sender.isYou)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessagesSquare className="h-4 w-4" />
          <span>Conversation History</span>
          <Badge variant="secondary">
            {conversation.length} letters
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <a 
            href={`/conversation/${conversation[0]?.id}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center"
          >
            <Button variant="outline" size="icon" title="View full conversation history">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="text-destructive"
            onClick={() => setShowDeleteDialog(true)}
            title="Delete entire conversation"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={conversationContainerRef}
        className="max-h-[calc(100vh-200px)] overflow-y-auto border rounded-md p-4"
      >
        <div className="space-y-4">
          {conversation.map((message, index) => (
            <div key={message.id} className="flex flex-col gap-2">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <CollapsibleMessage 
                    message={message}
                    isActive={message.id === activeMessageId}
                    isExpanded={expandedMessages[message.id]}
                    onToggleExpand={() => toggleMessageExpand(message.id)}
                  />
                </div>
              </div>
              
              {showComposeButton && 
               !message.sender.isYou && 
               message.id === lastSender?.id && (
                <div className="flex justify-end mt-2">
                  <ComposeLetterButton 
                    recipientId={lastSender.id} 
                    recipientName={lastSender.sender.name} 
                    size="sm"
                    variant="outline"
                    conversation={true}
                  >
                    Compose a Letter
                  </ComposeLetterButton>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Entire Conversation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entire conversation? This action cannot be undone and will remove all letters in this thread.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete Conversation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConversationHistory;
