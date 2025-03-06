
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  MessagesSquare, 
  ChevronUp, 
  ChevronDown, 
  Trash, 
  AlertTriangle 
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
  onDeleteMessage?: (messageId: string) => void;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ 
  conversation,
  activeMessageId,
  onScrollToQuote,
  onDeleteMessage
}) => {
  const [showConversation, setShowConversation] = useState(false);
  const conversationContainerRef = React.useRef<HTMLDivElement>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleDelete = (messageId: string) => {
    setMessageToDelete(messageId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (messageToDelete && onDeleteMessage) {
      onDeleteMessage(messageToDelete);
    }
    setShowDeleteDialog(false);
    setMessageToDelete(null);
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
              <div key={message.id} className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <CollapsibleMessage 
                    message={message}
                    isActive={message.id === activeMessageId}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  {!message.sender.isYou && (
                    <ComposeLetterButton 
                      recipientId={message.id} 
                      recipientName={message.sender.name} 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2"
                    >
                      Reply
                    </ComposeLetterButton>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive h-8 px-2"
                    onClick={() => handleDelete(message.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reply button for the conversation */}
      {lastSender && (
        <div className="mt-4">
          <ComposeLetterButton 
            recipientId={lastSender.id} 
            recipientName={lastSender.sender.name} 
            className="w-full"
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this letter? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConversationHistory;
