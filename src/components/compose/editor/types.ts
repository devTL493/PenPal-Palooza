
import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type ParagraphElement = {
  type: 'paragraph';
  align?: 'left' | 'center' | 'right' | 'justify';
  children: CustomText[];
};

export type PageElement = {
  type: 'page';
  pageNumber?: number;
  pageCount?: number;
  children: ParagraphElement[];
};

export type CustomElement = ParagraphElement | PageElement;

export type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
};

export type CustomText = FormattedText;

export type Position = {
  x: number;
  y: number;
};

export const DEFAULT_INITIAL_VALUE: Descendant[] = [
  {
    type: 'page',
    pageNumber: 1,
    pageCount: 1,
    children: [
      {
        type: 'paragraph',
        children: [
          { text: '' }
        ]
      }
    ]
  }
];

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
