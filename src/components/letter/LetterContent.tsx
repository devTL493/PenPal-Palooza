
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LetterContentProps {
  content: string;
  preview?: string;
  showContent: boolean;
}

const LetterContent: React.FC<LetterContentProps> = ({ 
  content, 
  preview, 
  showContent 
}) => {
  if (!showContent) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        className="max-h-[calc(100vh-300px)] overflow-y-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="paper p-8 border rounded-md mb-6 whitespace-pre-line font-serif a4-paper">
          {content || preview}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LetterContent;
