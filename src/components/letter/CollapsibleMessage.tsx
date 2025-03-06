
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConversationMessage } from '@/types/letter';

interface CollapsibleMessageProps {
  message: ConversationMessage;
  isActive?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onTextSelection?: (e: React.MouseEvent, messageId: string) => void;
}

const CollapsibleMessage: React.FC<CollapsibleMessageProps> = ({
  message,
  isActive = false,
  isExpanded = false,
  onToggleExpand,
  onTextSelection
}) => {
  const [isOpen, setIsOpen] = useState(isActive);
  const firstInitial = message.sender.name.charAt(0).toUpperCase();
  
  // For shorter previews (under 150 chars), don't truncate
  const isBrief = message.content.length < 150;
  const preview = isBrief 
    ? message.content 
    : message.content.substring(0, 150) + '...';

  // If isExpanded is provided (controlled from parent), use that instead of local state
  const displayState = onToggleExpand ? isExpanded : isOpen;
  
  // Use the toggle function from parent if provided, otherwise use local state
  const toggleOpen = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setIsOpen(!isOpen);
    }
  };

  // Handle text selection events
  const handleMouseUp = (e: React.MouseEvent) => {
    if (onTextSelection) {
      onTextSelection(e, message.id);
    }
  };

  return (
    <div 
      id={message.id}
      className={`relative border p-4 rounded-md transition-all duration-300 ${
        isActive ? 'ring-2 ring-primary' : ''
      }`}
      onMouseUp={handleMouseUp}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {message.sender.avatar && (
              <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
            )}
            <AvatarFallback>{firstInitial}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{message.sender.name}</div>
            <div className="text-xs text-muted-foreground">{message.date}</div>
          </div>
        </div>
        
        {!isBrief && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={toggleOpen}
          >
            {displayState ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      
      <div className="whitespace-pre-wrap pl-10">
        {displayState || isBrief ? message.content : preview}
      </div>
    </div>
  );
};

export default CollapsibleMessage;
