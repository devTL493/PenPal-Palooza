
import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { TextAlignment } from '@/types/letter';

// Define custom element types
export type CustomElement = {
  type: 'paragraph' | 'page';
  children: (CustomElement | CustomText)[];
  align?: TextAlignment | string;
  pageNumber?: number;
  pageCount?: number;
};

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
};

// Custom type declarations for Slate
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// Create safe initial value that conforms to our types
export const DEFAULT_INITIAL_VALUE = [
  {
    type: 'page',
    children: [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ],
    pageNumber: 1,
    pageCount: 1,
  },
];

export const PAGE_HEIGHT = 1100; // Approximately A4 height in pixels
