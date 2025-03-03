import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Reply, 
  Bookmark, 
  BookmarkCheck, 
  Paperclip, 
  Calendar, 
  Mail, 
  MessagesSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Navigation from '@/components/Navigation';

// Sample data (in a real app, this would come from a database or API)
const inboxLetters = [
  {
    id: '1',
    sender: {
      name: 'Emily Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
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
    date: 'May 15, 2023',
  },
  // ... other letters would be defined here
];

const sentLetters = [
  // ... sent letters would be defined here
];

// Sample conversation history data
// Each conversation is an array of letters between the same people
const conversations = {
  '1': [
    {
      id: 'c1-1',
      sender: {
        name: 'You',
        isYou: true,
      },
      content: `Dear Emily,

I hope this letter finds you well. I've been thinking about taking a trip abroad this year, and I'd love to hear your recommendations. I know you've traveled extensively through Asia, and I'm particularly interested in Japan.

What would you say are the must-see places? And is there a particular time of year that you'd recommend visiting?

Looking forward to your insights,
Me`,
      date: 'May 1, 2023',
    },
    {
      id: 'c1-2',
      sender: {
        name: 'Emily Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
      },
      content: `Dear Friend,

I was so happy to receive your letter! Japan is one of my favorite places in the world, and I think you would absolutely love it.

If you're able to plan your trip for spring (late March to early April), you might be lucky enough to catch the cherry blossoms in bloom. It's a magical experience and worth planning around.

As for must-see places, I would recommend splitting your time between Tokyo and Kyoto. Tokyo is a fascinating blend of ultra-modern and traditional, while Kyoto offers a more serene experience with its temples and gardens.

Let me know if you decide to go! I'd be happy to share more specific recommendations.

Warmly,
Emily`,
      date: 'May 5, 2023',
    },
    {
      id: 'c1-3',
      sender: {
        name: 'You',
        isYou: true,
      },
      content: `Dear Emily,

Thank you for your suggestions! I've started researching flights for next spring. The cherry blossom season sounds absolutely magical.

I'm curious - what was your most memorable experience in Japan? Was there something unexpected that really stood out to you?

Best,
Me`,
      date: 'May 10, 2023',
    },
    {
      id: '1', // This is the letter shown in the detail view initially
      sender: {
        name: 'Emily Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
      },
      content: `Dear Friend,

I wanted to tell you about my recent trip to Japan. The cherry blossoms were in full bloom and it reminded me of our conversation about traveling to see natural wonders.

The streets of Kyoto were lined with these magnificent trees, creating tunnels of soft pink petals that would occasionally float down in the gentle breeze. I spent hours sitting in parks, just watching the petals fall like snow.

I remembered how you once told me that you've always wanted to see the cherry blossoms in Japan. I think you would truly love it here. The attention to detail in everything from food presentation to garden design is remarkable.

I visited a traditional tea house where the ceremony was performed with such precision and grace. Each movement had meaning, each gesture a purpose. It made me think about how rarely we move with intention in our day-to-day lives.

Have you had any adventures lately? I'd love to hear about them in your next letter.

Warmly,
Emily`,
      date: 'May 15, 2023',
    }
  ],
  // Other conversations would be defined here
};

// Combine all letters for easier lookup
const allLetters = [...inboxLetters, ...sentLetters];

const LetterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConversation, setShowConversation] = useState(false);
  
  // Find the letter with the matching ID
  const letter = allLetters.find(letter => letter.id === id);
  
  // Get the conversation if it exists
  const conversation = id ? conversations[id] : null;
  
  // Handle case where letter is not found
  if (!letter) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <h1 className="mt-4 text-2xl font-medium">Letter not found</h1>
            <p className="mt-2 text-muted-foreground">The letter you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Letter Header */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inbox
            </Button>
            
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                {letter.sender.avatar ? (
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarImage src={letter.sender.avatar} alt={letter.sender.name} />
                    <AvatarFallback>{letter.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-12 w-12 bg-primary/10 text-primary">
                    <AvatarFallback>{letter.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                
                <div>
                  <h1 className="text-2xl font-serif font-medium">{letter.sender.name}</h1>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{letter.date || letter.timestamp}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {letter.hasAttachments && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    Attachments
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Conversation History Button */}
          {conversation && conversation.length > 1 && (
            <Button
              variant="outline"
              onClick={() => setShowConversation(!showConversation)}
              className="mb-4 w-full flex justify-between"
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
          )}
          
          {/* Conversation History */}
          {showConversation && conversation && (
            <div className="space-y-6 mb-6">
              <h2 className="text-lg font-medium font-serif">Conversation History</h2>
              
              {conversation.map((historyLetter, index) => (
                <div 
                  key={historyLetter.id} 
                  className={`paper border rounded-md p-6 ${
                    historyLetter.id === id ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-4 mb-3">
                    {historyLetter.sender.avatar ? (
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={historyLetter.sender.avatar} alt={historyLetter.sender.name} />
                        <AvatarFallback>{historyLetter.sender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className={`h-10 w-10 ${historyLetter.sender.isYou ? 'bg-secondary' : 'bg-primary/10'}`}>
                        <AvatarFallback>{historyLetter.sender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium font-serif">
                          {historyLetter.sender.name}
                          {historyLetter.sender.isYou && (
                            <Badge variant="secondary" className="ml-2">
                              You
                            </Badge>
                          )}
                        </h3>
                        <span className="text-sm text-muted-foreground">{historyLetter.date}</span>
                      </div>
                      
                      <div className="mt-2 text-sm whitespace-pre-line font-serif">
                        {historyLetter.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Letter Content (when not showing conversation) */}
          {!showConversation && (
            <div className="paper p-8 border rounded-md mb-6 whitespace-pre-line font-serif">
              {letter.content || letter.preview}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline">
              <Reply className="mr-2 h-4 w-4" />
              Reply
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline">
                {letter.hasSaved ? 
                  <><BookmarkCheck className="mr-2 h-4 w-4" />Saved</> :
                  <><Bookmark className="mr-2 h-4 w-4" />Save</>
                }
              </Button>
              
              <Link to="/compose">
                <Button>
                  <Reply className="mr-2 h-4 w-4" />
                  Write a Letter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LetterDetail;
