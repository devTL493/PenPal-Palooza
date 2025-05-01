import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import NotFoundMessage from '@/components/letter/NotFoundMessage';
import HighlightStyles from '@/components/letter/HighlightStyles';
import FloatingComposeButton from '@/components/letter/FloatingComposeButton';
import { useMobile } from '@/hooks/use-mobile';
import { useComposeView } from '@/hooks/useComposeView';
import ComposeViewOption from '@/components/letter/ComposeViewOption';
import LetterDetailView from '@/components/letter/LetterDetailView';
import { useLetterDetail } from '@/hooks/useLetterDetail';

// Sample data (in a real app, this would come from a database or API)
const inboxLetters = [{
  id: '1',
  sender: {
    id: '101',
    name: 'Emily Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop'
  },
  preview: 'I wanted to tell you about my recent trip to Japan. The cherry blossoms were in full bloom and it reminded me of our conversation about...',
  content: `Dear Friend,

I wanted to tell you about my recent trip to Japan. The cherry blossoms were in full bloom and it reminded me of our conversation about traveling to see natural wonders.

The streets of Kyoto were lined with these magnificent trees, creating tunnels of soft pink petals that would occasionally float down in the gentle breeze. I spent hours sitting in parks, just watching the petals fall like snow.

I remembered how you once told me that you've always wanted to see the cherry blossoms in Japan. I think you would truly love it here. The attention to detail in everything from food presentation to garden design is remarkable.

I visited a traditional tea house where the ceremony was performed with such precision and grace. Each movement had meaning, each gesture a purpose. It made me think about how rarely we move with intention in our day-to-day lives.

Have you had any adventures lately? I'd love to hear about them in your next letter.

Warmly,
Emily`,
  timestamp: '2 hours ago',
  isUnread: true,
  hasAttachments: true,
  date: 'May 15, 2023'
}];

// Sample conversation history data
const conversations = {
  '1': [{
    id: 'c1-1',
    sender: {
      name: 'You',
      isYou: true
    },
    content: `Dear Emily,

I hope this letter finds you well. I've been thinking about taking a trip abroad this year, and I'd love to hear your recommendations. I know you've traveled extensively through Asia, and I'm particularly interested in Japan.

What would you say are the must-see places? And is there a particular time of year that you'd recommend visiting?

Looking forward to your insights,
Me`,
    date: 'May 1, 2023'
  }, {
    id: 'c1-2',
    sender: {
      name: 'Emily Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop'
    },
    content: `Dear Friend,

    I was so happy to receive your letter! Japan is one of my favorite places in the world, and I think you would absolutely love it.

    If you're able to plan your trip for spring (late March to early April), you might be lucky enough to catch the cherry blossoms in bloom. It's a magical experience and worth planning around.

    As for must-see places, I would recommend splitting your time between Tokyo and Kyoto. Tokyo is a fascinating blend of ultra-modern and traditional, while Kyoto offers a more serene experience with its temples and gardens.

    Let me know if you decide to go! I'd be happy to share more specific recommendations.

    Warmly,
    Emily`,
    date: 'May 5, 2023'
  }, {
    id: 'c1-3',
    sender: {
      name: 'You',
      isYou: true
    },
    content: `Dear Emily,

    Thank you for your suggestions! I've started researching flights for next spring. The cherry blossom season sounds absolutely magical.

    I'm curious - what was your most memorable experience in Japan? Was there something unexpected that really stood out to you?

    Best,
    Me`,
    date: 'May 10, 2023'
  }, {
    id: '1',
    sender: {
      name: 'Emily Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop'
    },
    content: `Dear Friend,

    I wanted to tell you about my recent trip to Japan. The cherry blossoms were in full bloom and it reminded me of our conversation about traveling to see natural wonders.

    The streets of Kyoto were lined with these magnificent trees, creating tunnels of soft pink petals that would occasionally float down in the gentle breeze. I spent hours sitting in parks, just watching the petals fall like snow.

    I remembered how you once told me that you've always wanted to see the cherry blossoms in Japan. I think you would truly love it here. The attention to detail in everything from food presentation to garden design is remarkable.

    I visited a traditional tea house where the ceremony was performed with such precision and grace. Each movement had meaning, each gesture a purpose. It made me think about how rarely we move with intention in our day-to-day lives.

    Have you had any adventures lately? I'd love to hear about them in your next letter.

    Warmly,
    Emily`,
    date: 'May 15, 2023'
  }]
};

const LetterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useMobile();

  // Use the same view management hook as the compose page
  const {
    viewMode,
    setViewMode,
    isPanelReversed,
    isWideScreen,
    togglePanelPosition
  } = useComposeView();

  // Use our custom hook for letter detail functionality
  const {
    letter,
    isFavorite,
    toggleFavorite,
    scrollToQuote,
    handleDeleteConversation,
    conversation
  } = useLetterDetail(id, inboxLetters, conversations);

  if (!letter) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <NotFoundMessage />
        </main>
      </div>
    );
  }

  const shouldShowConversation = conversation && conversation.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="w-full px-4 pt-24 pb-16">
        <div className="w-full max-w-screen-2xl mx-auto">
          <div className="mb-4 space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Inbox
              </Button>
              
              {/* View mode selector */}
              {shouldShowConversation && (
                <ComposeViewOption 
                  currentMode={viewMode}
                  onModeChange={setViewMode}
                  recipientId={letter.sender.id || ''}
                />
              )}
            </div>
          </div>
          
          {/* Letter detail view */}
          <LetterDetailView 
            letter={letter}
            conversation={conversation}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            onScrollToQuote={scrollToQuote}
            onDeleteConversation={handleDeleteConversation}
            viewMode={viewMode}
            isWideScreen={isWideScreen}
            isPanelReversed={isPanelReversed}
            togglePanelPosition={togglePanelPosition}
          />
        </div>
      </main>
      
      {isMobile && (
        <FloatingComposeButton 
          recipientId={letter.id}
          recipientName={letter.sender.name}
        />
      )}
      
      <HighlightStyles />
    </div>
  );
};

export default LetterDetail;
