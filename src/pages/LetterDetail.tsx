import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Reply, Bookmark, BookmarkCheck, Paperclip, Calendar, Mail } from 'lucide-react';
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

// Combine all letters for easier lookup
const allLetters = [...inboxLetters, ...sentLetters];

const LetterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the letter with the matching ID
  const letter = allLetters.find(letter => letter.id === id);
  
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
          
          {/* Letter Content */}
          <div className="paper p-8 border rounded-md mb-6 whitespace-pre-line font-serif">
            {letter.content || letter.preview}
          </div>
          
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
