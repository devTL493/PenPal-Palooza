
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

export interface FontOption {
  value: string;
  label: string;
}

export interface FontSizeOption {
  value: string;
  label: string;
}

export interface ColorOption {
  value: string;
  label: string;
  color: string;
}

export interface PaperStyleOption {
  value: string;
  label: string;
  description: string;
}

export interface BorderStyleOption {
  value: string;
  label: string;
  description: string;
}

export interface ConversationMessage {
  id: string;
  sender: {
    name: string;
    avatar?: string;
    isYou?: boolean;
  };
  content: string;
  date: string;
}
