
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useComposeView } from '@/hooks/useComposeView';

interface Sender {
  id?: string;
  name: string;
  avatar?: string;
}

interface Letter {
  id: string;
  sender: Sender;
  preview: string;
  content: string;
  timestamp: string;
  isUnread: boolean;
  hasAttachments: boolean;
  date: string;
}

interface ConversationItem {
  id: string;
  sender: {
    name: string;
    isYou?: boolean;
    avatar?: string;
  };
  content: string;
  date: string;
}

export interface UseLetterDetailResult {
  letter: Letter | undefined;
  isFavorite: boolean;
  toggleFavorite: () => void;
  activeQuoteId: string | null;
  setActiveQuoteId: React.Dispatch<React.SetStateAction<string | null>>;
  scrollToQuote: (quoteId: string) => void;
  handleDeleteConversation: () => void;
  conversation: ConversationItem[] | null;
}

export const useLetterDetail = (
  id: string | undefined,
  inboxLetters: Letter[],
  conversationsData: Record<string, ConversationItem[]>
): UseLetterDetailResult => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);

  const [currentConversation, setCurrentConversation] = useState(() => {
    return id && conversationsData[id] ? [...conversationsData[id]] : [];
  });

  const letter = inboxLetters.find(letter => letter.id === id);
  const conversation = currentConversation.length > 0 ? currentConversation : null;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Letter removed from your favorites" : "Letter added to your favorites"
    });
  };

  const scrollToQuote = (quoteId: string) => {
    setActiveQuoteId(quoteId);
  };

  const handleDeleteConversation = () => {
    toast({
      title: "Conversation deleted",
      description: "The entire conversation has been permanently removed."
    });
    navigate('/dashboard');
  };

  return {
    letter,
    isFavorite,
    toggleFavorite,
    activeQuoteId,
    setActiveQuoteId,
    scrollToQuote,
    handleDeleteConversation,
    conversation
  };
};
