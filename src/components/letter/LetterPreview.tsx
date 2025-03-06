
import React from 'react';
import StyledQuote from './StyledQuote';
import { TextAlignment, InlineStyle } from '@/types/letter';

interface LetterPreviewProps {
  content: string;
  documentStyle: {
    font: string;
    size: string;
    color: string;
    alignment: TextAlignment;
  };
  inlineStyles: InlineStyle[];
  scrollToQuoteInConversation: (quoteId: string) => void;
}

const LetterPreview: React.FC<LetterPreviewProps> = ({
  content,
  documentStyle,
  inlineStyles,
  scrollToQuoteInConversation
}) => {
  if (!content) return <p className="text-gray-400">Your letter will appear here...</p>;
  
  // Create spans with appropriate styling
  let result = [];
  let lastIndex = 0;
  
  // Parse blockquotes for styling
  const quoteRegex = /<blockquote data-sender="([^"]*)" data-date="([^"]*)">\n([\s\S]*?)\n<\/blockquote>/g;
  let match;
  let quoteMatches = [];
  
  // Extract all quotes and their metadata
  while ((match = quoteRegex.exec(content)) !== null) {
    quoteMatches.push({
      fullMatch: match[0],
      sender: match[1],
      date: match[2],
      text: match[3],
      index: match.index
    });
  }
  
  // Sort styles by start position
  const sortedStyles = [...inlineStyles].sort((a, b) => a.start - b.start);
  
  // First, handle regular styling
  for (let i = 0; i < sortedStyles.length; i++) {
    const style = sortedStyles[i];
    
    // Add text before this style if needed
    if (style.start > lastIndex) {
      const textSegment = content.substring(lastIndex, style.start);
      
      // Check if this segment contains quotes
      let segmentLastIndex = 0;
      let segmentResult = [];
      
      for (const quote of quoteMatches) {
        if (quote.index >= lastIndex && quote.index < style.start) {
          // Add text before the quote
          if (quote.index > lastIndex + segmentLastIndex) {
            segmentResult.push(
              content.substring(lastIndex + segmentLastIndex, quote.index)
            );
          }
          
          // Add the styled quote
          segmentResult.push(
            <StyledQuote 
              key={`quote-${quote.index}`}
              quote={quote}
              onClick={() => scrollToQuoteInConversation(`quote-${quote.index}`)}
            />
          );
          
          segmentLastIndex = (quote.index - lastIndex) + quote.fullMatch.length;
        }
      }
      
      // Add any remaining text
      if (segmentLastIndex < style.start - lastIndex) {
        segmentResult.push(
          content.substring(lastIndex + segmentLastIndex, style.start)
        );
      }
      
      // If we processed quotes, add the segments; otherwise, add the whole text
      if (segmentResult.length > 0) {
        result.push(
          <span key={`plain-${lastIndex}`} className={`${documentStyle.font} ${documentStyle.size} ${documentStyle.color}`}>
            {segmentResult}
          </span>
        );
      } else {
        result.push(
          <span key={`plain-${lastIndex}`} className={`${documentStyle.font} ${documentStyle.size} ${documentStyle.color}`}>
            {textSegment}
          </span>
        );
      }
    }
    
    // Create the styled span
    const spanClasses = `
      ${style.font || documentStyle.font}
      ${style.size || documentStyle.size}
      ${style.color || documentStyle.color}
      ${style.isBold ? 'font-bold' : ''}
      ${style.isItalic ? 'italic' : ''}
      ${style.isUnderline ? 'underline' : ''}
      ${style.isLink ? 'cursor-pointer' : ''}
    `;
    
    const styledText = content.substring(style.start, style.end);
    
    if (style.isLink) {
      result.push(
        <a 
          key={`styled-${style.start}-${style.end}`} 
          href={style.linkUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className={spanClasses}
        >
          {styledText}
        </a>
      );
    } else {
      result.push(
        <span key={`styled-${style.start}-${style.end}`} className={spanClasses}>
          {styledText}
        </span>
      );
    }
    
    lastIndex = style.end;
  }
  
  // Add any remaining text after the last style
  if (lastIndex < content.length) {
    const remainingText = content.substring(lastIndex);
    
    // Check for quotes in the remaining text
    let segmentLastIndex = 0;
    let segmentResult = [];
    
    for (const quote of quoteMatches) {
      if (quote.index >= lastIndex) {
        // Add text before the quote
        if (quote.index > lastIndex + segmentLastIndex) {
          segmentResult.push(
            remainingText.substring(segmentLastIndex, quote.index - lastIndex)
          );
        }
        
        // Add the styled quote
        segmentResult.push(
          <StyledQuote 
            key={`quote-${quote.index}`}
            quote={quote}
            onClick={() => scrollToQuoteInConversation(`quote-${quote.index}`)}
          />
        );
        
        segmentLastIndex = (quote.index - lastIndex) + quote.fullMatch.length;
      }
    }
    
    // Add any remaining text
    if (segmentLastIndex < remainingText.length) {
      segmentResult.push(
        remainingText.substring(segmentLastIndex)
      );
    }
    
    // If we processed quotes, add the segments; otherwise, add the whole text
    if (segmentResult.length > 0) {
      result.push(
        <span key={`plain-end`} className={`${documentStyle.font} ${documentStyle.size} ${documentStyle.color}`}>
          {segmentResult}
        </span>
      );
    } else {
      result.push(
        <span key={`plain-end`} className={`${documentStyle.font} ${documentStyle.size} ${documentStyle.color}`}>
          {remainingText}
        </span>
      );
    }
  }
  
  return <div className={`${documentStyle.alignment} whitespace-pre-wrap`}>{result}</div>;
};

export default LetterPreview;
