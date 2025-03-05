
import React from 'react';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { 
  Clock, 
  Mail, 
  Heart,
  Paperclip,
} from 'lucide-react';

export interface LetterCardProps {
  id: string;
  sender: {
    name: string;
    avatar?: string;
  };
  preview: string;
  timestamp: string;
  isUnread?: boolean;
  isFavorite?: boolean;
  hasAttachments?: boolean;
  onClick?: () => void;
  className?: string;
}

const LetterCard: React.FC<LetterCardProps> = ({
  id,
  sender,
  preview,
  timestamp,
  isUnread = false,
  isFavorite = false,
  hasAttachments = false,
  onClick,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card 
        onClick={onClick}
        className={cn(
          "paper w-full cursor-pointer overflow-hidden transition-all duration-300 hover:translate-y-[-2px]",
          isUnread ? "border-primary/20" : "border-border",
          className
        )}
      >
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {sender.avatar ? (
                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-border">
                  <img 
                    src={sender.avatar} 
                    alt={sender.name}
                    className="object-cover w-full h-full"
                    loading="lazy" 
                    onLoad={(e) => e.currentTarget.parentElement?.classList.remove('image-loading')}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                  {sender.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-foreground">{sender.name}</h3>
                <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                  <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                  <span>{timestamp}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-1.5">
              {hasAttachments && (
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              )}
              
              {isFavorite ? (
                <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
              ) : (
                <Heart className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              
              {isUnread && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-sm line-clamp-2 text-foreground/80">{preview}</p>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              <Mail className="h-3 w-3 mr-1" />
              Letter
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default LetterCard;
