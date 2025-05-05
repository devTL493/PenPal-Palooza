
import { useCallback } from 'react';
import { DefaultElement, PageElement } from './Elements';
import { LetterStyle } from '@/types/letter';
import Leaf from './Leaf';

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
