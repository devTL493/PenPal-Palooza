
import React from 'react';
import { LetterStyle } from '@/types/letter';

interface PageElementProps {
  attributes: any;
  children: React.ReactNode;
  element: any;
  letterStyle: LetterStyle;
  dimensions: { width: string | number; height: string | number };
}

export const PageElement = ({ attributes, children, element, letterStyle, dimensions }: PageElementProps) => {
  return (
    <div
      {...attributes}
      className={`${letterStyle.paperStyle} ${letterStyle.borderStyle} page texture shadow-paper scroll-snap-align-start mb-6`}
      style={{ 
        width: dimensions.width,
        minHeight: dimensions.height,
        padding: '2cm',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {children}
      <div className="absolute bottom-2 right-0 left-0 text-center text-xs text-gray-400">
        Page {/* Page number would be calculated here */}
      </div>
    </div>
  );
};

interface DefaultElementProps {
  attributes: any;
  children: React.ReactNode;
}

export const DefaultElement = ({ attributes, children }: DefaultElementProps) => {
  return <p {...attributes}>{children}</p>;
};
