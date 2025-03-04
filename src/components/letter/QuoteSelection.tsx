
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
  onQuoteSelected: (quote: string, metadata: { sender: string, date: string }) => void;
}

const QuoteSelection: React.FC<QuoteSelectionProps> = ({ 
  conversation,
  onQuoteSelected 
}) => {
  const [open, setOpen] = useState(false);
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  
  const handleTextSelection = (e: React.MouseEvent, messageId: string) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString().trim());
      setSelectedMessageId(messageId);
    }
  };
  
  const handleQuoteSelection = () => {
    if (!selectedText || !selectedMessageId) return;
    
    const message = conversation.find(msg => msg.id === selectedMessageId);
    if (!message) return;
    
    // Pass both the selected text and metadata
    onQuoteSelected(
      selectedText, 
      { 
        sender: message.sender.name, 
        date: message.date 
      }
    );
    setOpen(false);
    setSelectedText("");
    setSelectedMessageId(null);
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
        <h3 className="font-medium mb-2">Select text to quote</h3>
        <p className="text-sm text-muted-foreground mb-4">Highlight text from a message below to quote it in your letter.</p>
        
        {selectedText && (
          <div className="mb-4 p-3 bg-secondary/20 rounded-md border">
            <p className="text-sm font-medium">Selected quote:</p>
            <p className="text-sm italic mt-1">{selectedText}</p>
            <Button 
              size="sm" 
              className="mt-2 w-full" 
              onClick={handleQuoteSelection}
            >
              Insert Quote
            </Button>
          </div>
        )}
        
        <div className="space-y-3">
          {conversation.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages to quote from.</p>
          ) : (
            conversation.map((message) => (
              <div 
                key={message.id} 
                className={`border rounded-md p-3 hover:bg-accent/10 ${selectedMessageId === message.id ? 'ring-2 ring-primary' : ''}`}
                onMouseUp={(e) => handleTextSelection(e, message.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{message.sender.name}</span>
                  <span className="text-xs text-muted-foreground">{message.date}</span>
                </div>
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuoteSelection;
