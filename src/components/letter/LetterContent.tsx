
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '@/types/letter';
import { formatDistanceToNow } from 'date-fns';

interface LetterContentProps {
  content: string;
  preview?: string;
  showContent: boolean;
  sender?: UserProfile;
  timestamp?: string;
  isYourMessage?: boolean;
}

const LetterContent: React.FC<LetterContentProps> = ({ 
  content, 
  preview, 
  showContent,
  sender,
  timestamp,
  isYourMessage = false
}) => {
  if (!showContent) return null;
  
  // Format the timestamp if provided
  const formattedTime = timestamp ? 
    formatDistanceToNow(new Date(timestamp), { addSuffix: true }) : 
    '';
  
  return (
    <AnimatePresence>
      <motion.div 
        className="max-h-[calc(100vh-300px)] overflow-y-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={`p-6 rounded-lg mb-6 whitespace-pre-line ${isYourMessage ? 'bg-primary/10 ml-8' : 'bg-paper border mr-8'}`}>
          <div className="flex items-center mb-2 justify-between">
            <div className="flex items-center">
              {sender && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                    {sender.username?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div className="font-medium">{sender.username || 'Anonymous'}</div>
                </div>
              )}
            </div>
            {timestamp && <div className="text-xs text-muted-foreground">{formattedTime}</div>}
          </div>
          <div className="font-serif">
            {content || preview}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LetterContent;
