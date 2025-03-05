
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
        className="paper p-8 border rounded-md mb-6 whitespace-pre-line font-serif"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {content || preview}
      </motion.div>
    </AnimatePresence>
  );
};

export default LetterContent;
