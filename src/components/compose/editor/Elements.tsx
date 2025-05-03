
import React from 'react';
import { LetterStyle } from '@/types/letter';

interface PageElementProps {
  attributes: any;
  children: React.ReactNode;
  element: any;
  letterStyle: LetterStyle;
  dimensions: { width: string | number; height: string | number };
  pageNumber?: number;
  pageCount?: number;
}

export const PageElement = ({ 
  attributes, 
  children, 
  element, 
  letterStyle, 
  dimensions,
  pageNumber = 1,
  pageCount = 1
}: PageElementProps) => {
  return (
    <div
      {...attributes}
      className={`${letterStyle.paperStyle} ${letterStyle.borderStyle} page texture shadow-paper scroll-snap-align-start mb-6`}
      style={{ 
        width: 'var(--page-width)',
        height: 'var(--page-height)',
        minHeight: 'var(--page-height)',
        padding: 'var(--margin)',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'visible'
      }}
      data-page={pageNumber}
      data-total-pages={pageCount}
    >
      {children}
      <div className="absolute bottom-2 right-0 left-0 text-center text-xs text-gray-400">
        Page {pageNumber} of {pageCount}
      </div>
    </div>
  );
};

interface DefaultElementProps {
  attributes: any;
  children: React.ReactNode;
  element: any;
}

export const DefaultElement = ({ attributes, children, element }: DefaultElementProps) => {
  const style: React.CSSProperties = {};
  
  if (element.align) {
    switch (element.align) {
      case 'center':
        style.textAlign = 'center';
        break;
      case 'right':
        style.textAlign = 'right';
        break;
      case 'justify':
        style.textAlign = 'justify';
        break;
      default:
        style.textAlign = 'left';
    }
  }
  
  return <p {...attributes} style={style}>{children}</p>;
};
