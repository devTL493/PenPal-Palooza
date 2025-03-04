
import React, { useState } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote } from 'lucide-react';

interface QuoteSelectionProps {
  conversation: Array<{
    id: string;
    sender: {
      name: string;
      isYou?: boolean;
    };
    content: string;
    date: string;
  }>;
  onQuoteSelected: (quote: string) => void;
}

const QuoteSelection: React.FC<QuoteSelectionProps> = ({ 
  conversation,
  onQuoteSelected 
}) => {
  const [open, setOpen] = useState(false);
  
  // Function to extract a selected quote from a message
  const extractQuote = (content: string): string => {
    const lines = content.split('\n');
    // Take up to 3 lines or 150 characters, whichever is shorter
    let quote = lines.slice(0, 3).join('\n');
    if (quote.length > 150) {
      quote = quote.substring(0, 147) + '...';
    } else if (lines.length > 3) {
      quote += '...';
    }
    return quote;
  };
  
  const handleQuoteMessage = (message: any) => {
    const quoteText = `> ${message.sender.name} wrote on ${message.date}:\n> ${extractQuote(message.content).replace(/\n/g, '\n> ')}\n\n`;
    onQuoteSelected(quoteText);
    setOpen(false);
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquareQuote className="h-4 w-4 mr-2" />
          Quote
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-96 overflow-y-auto">
        <h3 className="font-medium mb-3">Quote from conversation</h3>
        
        <div className="space-y-3">
          {conversation.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages to quote from.</p>
          ) : (
            conversation.map((message) => (
              <div key={message.id} className="border rounded-md p-3 hover:bg-accent/10 cursor-pointer" onClick={() => handleQuoteMessage(message)}>
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{message.sender.name}</span>
                  <span className="text-xs text-muted-foreground">{message.date}</span>
                </div>
                <p className="text-sm line-clamp-2">{extractQuote(message.content)}</p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuoteSelection;
