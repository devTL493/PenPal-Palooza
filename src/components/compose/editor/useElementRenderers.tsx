
/**
 * Element rendering hooks for SlateJS editor
 * Provides renderers for custom elements like pages and paragraphs
 */
import { useCallback } from 'react';
import { DefaultElement, PageElement } from './Elements';
import { LetterStyle } from '@/types/letter';

interface UseElementRenderersProps {
  letterStyle: LetterStyle;
  dimensions: any;
}

export function useElementRenderers({ letterStyle, dimensions }: UseElementRenderersProps) {
  // Define custom element renderer
  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case 'page':
        const pageProps = {
          ...props,
          letterStyle,
          dimensions,
          pageNumber: props.element.pageNumber,
          pageCount: props.element.pageCount || 1
        };
        return <PageElement {...pageProps} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, [letterStyle, dimensions]);

  // Define custom leaf renderer for text formatting
  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />;
  }, []);

  return {
    renderElement,
    renderLeaf
  };
}

// Simple leaf component for text formatting
const Leaf = (props: any) => {
  let { attributes, children, leaf } = props;

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
    children = <span style={{ color: leaf.color }}>{children}</span>;
  }

  if (leaf.fontFamily) {
    children = <span style={{ fontFamily: leaf.fontFamily }}>{children}</span>;
  }

  if (leaf.fontSize) {
    children = <span style={{ fontSize: leaf.fontSize }}>{children}</span>;
  }

  return <span {...attributes}>{children}</span>;
};
