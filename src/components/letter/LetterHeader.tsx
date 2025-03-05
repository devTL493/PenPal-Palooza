
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Paperclip } from 'lucide-react';

interface LetterHeaderProps {
  letter: {
    id: string;
    sender: {
      name: string;
      avatar?: string;
    };
    date?: string;
    timestamp?: string;
    hasAttachments?: boolean;
  };
  isFavorite: boolean;
  toggleFavorite: () => void;
}

const LetterHeader: React.FC<LetterHeaderProps> = ({ 
  letter, 
  isFavorite, 
  toggleFavorite 
}) => {
  return (
    <div className="mb-6">
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
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleFavorite}
            className={isFavorite ? "text-rose-500" : ""}
          >
            {isFavorite ? <Heart className="h-4 w-4 fill-rose-500" /> : <Heart className="h-4 w-4" />}
          </Button>
          
          {letter.hasAttachments && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              Attachments
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default LetterHeader;
