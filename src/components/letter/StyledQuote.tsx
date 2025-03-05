
import React from 'react';

interface StyledQuoteProps {
  quote: {
    text: string;
    sender: string;
    date: string;
    index: number;
  };
  onClick?: () => void;
}

const StyledQuote: React.FC<StyledQuoteProps> = ({ quote, onClick }) => {
  return (
    <div 
      key={`quote-${quote.index}`}
      className="my-4 p-4 bg-gray-800/10 border-l-4 border-gray-400 rounded italic relative group cursor-pointer"
      onClick={onClick}
      id={`quote-${quote.index}`}
    >
      <p>{quote.text}</p>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0 bg-black/70 text-white text-xs p-2 rounded pointer-events-none">
        <p>{quote.sender} wrote on {quote.date}</p>
      </div>
    </div>
  );
};

export default StyledQuote;
