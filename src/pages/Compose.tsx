
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Navigation from '@/components/Navigation';
import { Send, Paperclip, Save, Clock } from 'lucide-react';

// Sample pen pals for the demo
const samplePenPals = [
  { id: '1', name: 'Emily Chen' },
  { id: '2', name: 'Marcus Johnson' },
  { id: '3', name: 'Sophia Williams' },
  { id: '4', name: 'David Kim' },
];

const Compose = () => {
  const { toast } = useToast();
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content.trim() || subject.trim() || recipient) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [content, subject, recipient]);

  const handleAutoSave = () => {
    setIsSaving(true);
    
    // Simulate saving to a database
    setTimeout(() => {
      setLastSaved(new Date());
      setIsSaving(false);
    }, 800);
  };

  const handleSend = () => {
    if (!recipient) {
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

    // Simulate sending the letter
    toast({
      title: "Letter sent",
      description: "Your letter has been sent successfully.",
    });

    // Reset form after sending
    setRecipient('');
    setSubject('');
    setContent('');
    setLastSaved(null);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    return `Last saved at ${lastSaved.toLocaleTimeString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-medium mb-8">Compose Letter</h1>
          
          <Card className="paper">
            <CardHeader className="border-b border-border">
              <div className="space-y-4">
                <div>
                  <Select value={recipient} onValueChange={setRecipient}>
                    <SelectTrigger id="recipient">
                      <SelectValue placeholder="Select recipient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {samplePenPals.map((penpal) => (
                        <SelectItem key={penpal.id} value={penpal.id}>
                          {penpal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Input
                    id="subject"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="font-medium"
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <Textarea
                placeholder="Dear friend,&#10;&#10;Write your letter here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] font-serif text-lg leading-relaxed resize-none focus-visible:ring-0 border-0 p-0 shadow-none"
              />
            </CardContent>
            
            <CardFooter className="flex justify-between border-t border-border pt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                {isSaving ? (
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 animate-pulse" />
                    Saving...
                  </span>
                ) : lastSaved ? (
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {formatLastSaved()}
                  </span>
                ) : null}
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Attach
                </Button>
                <Button variant="outline" size="sm" onClick={handleAutoSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button size="sm" onClick={handleSend}>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Compose;
