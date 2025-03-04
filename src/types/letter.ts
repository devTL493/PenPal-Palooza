
export type TextAlignment = 'text-left' | 'text-center' | 'text-right';

export interface InlineStyle {
  start: number;
  end: number;
  font?: string;
  size?: string;
  color?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  alignment?: TextAlignment;
  isLink?: boolean;
  linkUrl?: string;
}

export interface LetterStyle {
  paperStyle: string;
  borderStyle: string;
}

export interface DocumentStyle {
  font: string;
  size: string;
  color: string;
  alignment: TextAlignment;
}
