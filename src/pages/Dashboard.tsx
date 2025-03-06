
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import LetterCard from '@/components/LetterCard';
import Navigation from '@/components/Navigation';
import { PenTool, Search, Inbox, Send, Mail, Heart } from 'lucide-react';

// Sample data
const inboxLetters = [
  {
    id: '1',
    sender: {
      name: 'Emily Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
    },
    preview: 'I wanted to tell you about my recent trip to Japan. The cherry blossoms were in full bloom and it reminded me of our conversation about...',
    timestamp: '2 hours ago',
    isUnread: true,
    hasAttachments: true,
  },
  {
    id: '2',
    sender: {
      name: 'Marcus Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
    },
    preview: 'Thank you for your thoughtful letter. It arrived on a day when I needed some encouragement. Your words about perseverance...',
    timestamp: 'Yesterday',
    isUnread: false,
  },
  {
    id: '3',
    sender: {
      name: 'Sophia Williams',
    },
    preview: "I've been thinking about what you wrote regarding the book we're both reading. The character development is indeed fascinating...",
    timestamp: '3 days ago',
    isUnread: false,
    isFavorite: true,
  },
  {
    id: '4',
    sender: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&auto=format&fit=crop',
    },
    preview: 'Your letter brought back memories of our college days. Remember when we would stay up all night discussing philosophy?...',
    timestamp: '1 week ago',
    isUnread: false,
  },
];

const sentLetters = [
  {
    id: '5',
    sender: {
      name: 'To: Emily Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
    },
    preview: "I hope this letter finds you well. I've been meaning to respond to your question about my favorite books...",
    timestamp: '1 day ago',
    hasAttachments: true,
  },
  {
    id: '6',
    sender: {
      name: 'To: Marcus Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
    },
    preview: "Thank you for sharing your story with me. It's remarkable how similar our childhood experiences were despite growing up in different...",
    timestamp: '4 days ago',
  },
];

const favoriteLetters = inboxLetters.filter(letter => letter.isFavorite);

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleOpenLetter = (id: string) => {
    console.log(`Opening letter ${id}`);
    navigate(`/letter/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-serif font-medium">Your Letters</h1>
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search your letters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="inbox" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="inbox" className="flex items-center">
                <Inbox className="mr-2 h-4 w-4" />
                Inbox
                <span className="ml-2 bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                  {inboxLetters.filter(l => l.isUnread).length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center">
                <Send className="mr-2 h-4 w-4" />
                Sent
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center">
                <Heart className="mr-2 h-4 w-4" />
                Favorites
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="inbox" className="space-y-4">
              {inboxLetters.length > 0 ? (
                inboxLetters.map((letter) => (
                  <LetterCard
                    key={letter.id}
                    {...letter}
                    onClick={() => handleOpenLetter(letter.id)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Inbox className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">Your inbox is empty</h3>
                  <p className="mt-1 text-muted-foreground">When you receive letters, they'll appear here.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="sent" className="space-y-4">
              {sentLetters.length > 0 ? (
                sentLetters.map((letter) => (
                  <LetterCard
                    key={letter.id}
                    {...letter}
                    onClick={() => handleOpenLetter(letter.id)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Send className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No sent letters</h3>
                  <p className="mt-1 text-muted-foreground">When you send letters, they'll appear here.</p>
                  <Link to="/compose" className="mt-4 inline-block">
                    <Button>
                      <PenTool className="mr-2 h-4 w-4" />
                      Write your first letter
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="favorites" className="space-y-4">
              {favoriteLetters.length > 0 ? (
                favoriteLetters.map((letter) => (
                  <LetterCard
                    key={letter.id}
                    {...letter}
                    onClick={() => handleOpenLetter(letter.id)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No favorite letters</h3>
                  <p className="mt-1 text-muted-foreground">Mark letters as favorites to save them for later.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
