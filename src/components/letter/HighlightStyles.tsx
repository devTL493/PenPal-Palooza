
import React from 'react';

const HighlightStyles: React.FC = () => {
  return (
    <style>{`
      @keyframes highlight-pulse {
        0% { background-color: rgba(59, 130, 246, 0.1); }
        50% { background-color: rgba(59, 130, 246, 0.3); }
        100% { background-color: rgba(59, 130, 246, 0.1); }
      }
      
      .highlight-pulse {
        animation: highlight-pulse 1s ease-in-out 2;
      }
    `}</style>
  );
};

export default HighlightStyles;
