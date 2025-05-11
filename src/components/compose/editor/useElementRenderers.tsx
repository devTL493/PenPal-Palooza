
/**
 * Hook for rendering custom elements in the SlateJS editor
 * Provides unified element and leaf rendering for the editor
 */
import React from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import { CustomEditor, CustomElement, ParagraphElement } from './types';

// Element components
const PageElement = ({ attributes, children, element, ...props }: any) => {
  const pageNumber = element.pageNumber || 1;
  const pageCount = element.pageCount || 1;
  
  return (
    <div 
      {...attributes}
      className="page relative"
      data-page={pageNumber} 
      data-total-pages={pageCount}
    >
      <div className="page-content">{children}</div>
      <div className="absolute bottom-2 right-0 left-0 text-center text-xs text-gray-400">
        Page {pageNumber} of {pageCount}
      </div>
    </div>
  );
};

const DefaultElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  
  // Apply alignment if specified - use type assertion to handle potential alignment property
  const style: React.CSSProperties = {};
  if ('align' in element && typeof element.align === 'string') {
    style.textAlign = element.align;
  }
  
  return <p style={style} {...attributes}>{children}</p>;
};

// Leaf component for text formatting
const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let style: React.CSSProperties = {};
  
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  
  if (leaf.color) {
    style.color = leaf.color;
  }
  
  if (leaf.fontFamily) {
    style.fontFamily = leaf.fontFamily;
  }
  
  if (leaf.fontSize) {
    style.fontSize = leaf.fontSize;
  }
  
  if (leaf.lineHeight) {
    style.lineHeight = leaf.lineHeight;
  }
  
  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};

interface UseElementRenderersProps {
  letterStyle: {
    paperStyle: string;
    borderStyle: string;
  };
  dimensions: {
    width: string | number;
    height: string | number;
  };
}

export function useElementRenderers({ letterStyle, dimensions }: UseElementRenderersProps) {
  // Render each element based on its type
  const renderElement = (props: RenderElementProps) => {
    const { element } = props;
    
    if (element.type === 'page') {
      return <PageElement {...props} />;
    }
    
    return <DefaultElement {...props} />;
  };

  // Render each leaf with appropriate formatting
  const renderLeaf = (props: RenderLeafProps) => {
    return <Leaf {...props} />;
  };

  return {
    renderElement,
    renderLeaf
  };
}
