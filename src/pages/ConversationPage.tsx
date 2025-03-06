import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash, AlertTriangle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useToast } from "@/hooks/use-toast";
import CollapsibleMessage from '@/components/letter/CollapsibleMessage';
import ComposeLetterButton from '@/components/letter/ComposeLetterButton';
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

// Sample conversation data (this would come from your API/database in a real app)
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
  // Other conversations would be defined here
};

// Sample drafts data
const savedDrafts = [
  {
    id: 'draft-1',
    recipientId: '1',
    subject: 'Reply to Emily about Japan',
    content: 'Dear Emily, I wanted to thank you for your detailed description of Japan...',
    date: 'May 17, 2023'
  }
];

const ConversationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);

  // Get the conversation based on ID
  const conversation = id && conversations[id] ? [...conversations[id]] : [];
  
  // Filter drafts for this conversation
  const conversationDrafts = savedDrafts.filter(draft => draft.recipientId === id);

  const handleDeleteConversation = () => {
    // In a real app, this would call an API to delete the conversation
    toast({
      title: "Conversation deleted",
      description: "The conversation has been permanently removed."
    });
    navigate('/dashboard');
  };

  if (!conversation || conversation.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inbox
            </Button>
            
            <div className="text-center p-8">
              <h2 className="text-2xl font-serif mb-2">Conversation not found</h2>
              <p className="text-muted-foreground mb-4">This conversation may have been deleted or does not exist.</p>
              <Button variant="default" onClick={() => navigate('/dashboard')}>
                Return to Inbox
              </Button>
            </div>
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
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDrafts(!showDrafts)}
              >
                {showDrafts ? "Hide Drafts" : "Show Saved Drafts"}
                {conversationDrafts.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {conversationDrafts.length}
                  </Badge>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Conversation
              </Button>
            </div>
          </div>
          
          <h1 className="text-2xl font-serif mb-6">Conversation with {conversation[0]?.sender.isYou ? conversation[1]?.sender.name : conversation[0]?.sender.name}</h1>
          
          {/* Saved Drafts Section */}
          {showDrafts && conversationDrafts.length > 0 && (
            <div className="mb-8 border rounded-md p-4">
              <h2 className="text-lg font-medium mb-4">Saved Drafts</h2>
              <div className="space-y-4">
                {conversationDrafts.map(draft => (
                  <div key={draft.id} className="border rounded-md p-4 bg-muted/30">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">{draft.subject}</h3>
                      <span className="text-sm text-muted-foreground">{draft.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{draft.content}</p>
                    <div className="flex justify-end gap-2">
                      <Link to={`/compose?draft=${draft.id}&conversation=true`}>
                        <Button variant="outline" size="sm">
                          Edit Draft
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Conversation Messages */}
          <div className="space-y-8">
            {conversation.map((message, index) => (
              <div key={message.id} className={`border rounded-lg p-6 ${message.sender.isYou ? 'bg-muted/20' : 'bg-white'}`}>
                <div className="flex justify-between mb-4">
                  <div className="font-medium">{message.sender.name}</div>
                  <div className="text-sm text-muted-foreground">{message.date}</div>
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {!message.sender.isYou && index === conversation.length - 1 && (
                  <div className="mt-4 flex justify-end">
                    <ComposeLetterButton 
                      recipientId={message.id} 
                      recipientName={message.sender.name} 
                      variant="outline"
                      size="sm"
                      conversation={true}
                    >
                      Reply to this Letter
                    </ComposeLetterButton>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Compose Button at Bottom */}
          <div className="mt-8">
            <ComposeLetterButton 
              recipientId={conversation.find(m => !m.sender.isYou)?.id} 
              recipientName={conversation.find(m => !m.sender.isYou)?.sender.name} 
              className="w-full"
              conversation={true}
            />
          </div>
        </div>
      </main>
      
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
              onClick={handleDeleteConversation}
            >
              Delete Conversation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConversationPage;
