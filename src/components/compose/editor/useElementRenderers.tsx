
/**
 * Hook for rendering custom elements in the SlateJS editor
 * Provides unified element and leaf rendering for the editor
 */
import React from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import { CustomEditor } from './types';

// Element components
const PageElement = ({ children, pageNumber, pageCount, ...attributes }: any) => {
  return (
    <div 
      {...attributes}
      className="page"
      data-page={pageNumber || 1} 
      data-total-pages={pageCount || 1}
    >
      <div className="page-content">{children}</div>
    </div>
  );
};

const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>;
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
    switch (props.element.type) {
      case 'page':
        const pageProps = {
          ...props,
          pageNumber: props.element.pageNumber || 1,
          pageCount: props.element.pageCount || 1
        };
        return <PageElement {...pageProps} />;
      default:
        return <DefaultElement {...props} />;
    }
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
