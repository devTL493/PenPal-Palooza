
import { useState, useEffect } from 'react';
import { UserProfile, ConversationMessage } from '@/types/letter';
import { useToast } from "@/hooks/use-toast";
import { samplePenPals, sampleConversation } from '@/data/sampleData';

interface UseComposeStateProps {
  conversationId?: string;
  searchParams: URLSearchParams;
  profile?: UserProfile | null;
}

const useComposeState = ({ conversationId, searchParams, profile }: UseComposeStateProps) => {
  const { toast } = useToast();
  
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientProfile, setRecipientProfile] = useState<UserProfile | null>(null);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isInConversationContext, setIsInConversationContext] = useState(!!conversationId);

  // Process query parameters
  useEffect(() => {
    const recipientId = searchParams.get('recipient');
    if (recipientId) {
      setRecipient(recipientId);
      
      // Get recipient name if provided
      const name = searchParams.get('name');
      if (name) {
        setRecipientName(name);
      } else {
        // Find name from sample penpal data
        const penpal = samplePenPals.find(p => p.id === recipientId);
        if (penpal) {
          setRecipientName(penpal.name);
        }
      }
    }

    // Always load sample conversation data to make sure we have something to show
    // This ensures the conversation history is visible for testing
    setConversation(sampleConversation);
    
    const conversationParam = searchParams.get('conversation');
    if (conversationParam === 'true') {
      setIsInConversationContext(true);
    }
    
    // Handle draft parameter
    const draftId = searchParams.get('draft');
    if (draftId) {
      // In a real app, you would fetch the draft from your database
      // For demo purposes, we'll use sample data
      setContent("Dear Emily, I wanted to thank you for your detailed description of Japan...");
      setSubject("Reply to Emily about Japan");
    }
  }, [searchParams]);
  
  // Fetch conversation messages when in conversation context
  useEffect(() => {
    if (conversationId) {
      // In a real app, fetch messages for this conversation
      // Here we're ensuring we always have the sample conversation loaded
      setConversation(sampleConversation);
      
      // Get recipient info
      if (sampleConversation.length > 0) {
        const otherPerson = sampleConversation.find(msg => !msg.sender.isYou);
        if (otherPerson) {
          setRecipientName(otherPerson.sender.name);
          setRecipient(conversationId); // Use conversation ID as recipient ID
        }
      }
      
      // Ensure we're in conversation context
      setIsInConversationContext(true);
    }
  }, [conversationId]);

  const handleSend = () => {
    if (!isInConversationContext && !recipient) {
      toast({
        title: "Recipient required",
        description: "Please select a recipient for your letter.",
        variant: "destructive",
      });
      return;
    }

    if (!subject.trim()) {
      toast({
        title: "Subject required",
        description: "Please add a subject to your letter.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Letter content required",
        description: "Your letter needs some content before sending.",
        variant: "destructive",
      });
      return;
    }
    
    // Create the letter object with styling information
    const letterData = {
      recipient: recipient || conversationId,
      subject,
      content,
      sentAt: new Date(),
    };
    
    console.log('Sending letter:', letterData);

    // Show success toast
    toast({
      title: "Letter sent",
      description: "Your letter has been sent successfully.",
    });
    
    // Add the new message to the conversation
    if (isInConversationContext) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        sender: {
          name: profile?.username || 'You',
          isYou: true,
        },
        content,
        date: new Date().toISOString(),
      };
      
      setConversation(prev => [...prev, newMessage]);
      
      // Clear the content for a new message
      setContent('');
    }
  };

  return {
    recipient,
    setRecipient,
    recipientName,
    setRecipientName,
    recipientProfile,
    setRecipientProfile,
    subject,
    setSubject,
    content,
    setContent,
    conversation,
    setConversation,
    isInConversationContext,
    setIsInConversationContext,
    handleSend
  };
};

export default useComposeState;
