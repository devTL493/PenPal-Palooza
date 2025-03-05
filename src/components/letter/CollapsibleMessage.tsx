
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CollapsibleMessageProps {
  message: {
    id: string;
    sender: {
      name: string;
      isYou?: boolean;
      avatar?: string;
    };
    content: string;
    date: string;
  };
  isActive?: boolean;
  onTextSelection?: (e: React.MouseEvent, messageId: string) => void;
}

const CollapsibleMessage: React.FC<CollapsibleMessageProps> = ({ 
  message, 
  isActive = false,
  onTextSelection
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (onTextSelection) {
      onTextSelection(e, message.id);
    }
  };

  return (
    <div 
      className={`p-4 rounded-md border ${
        message.sender.isYou 
          ? 'bg-secondary/20 ml-4' 
          : 'bg-muted/10 mr-4'
      } ${isActive ? 'ring-2 ring-primary' : ''}`}
      onMouseUp={handleMouseUp}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-medium">{message.sender.name}</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">{message.date}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-6 w-6"
            onClick={toggleCollapse}
          >
            {isCollapsed ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronUp className="h-4 w-4" />
            }
          </Button>
        </div>
      </div>
      
      {!isCollapsed && (
        <p className="whitespace-pre-line text-sm">{message.content}</p>
      )}
    </div>
  );
};

export default CollapsibleMessage;
