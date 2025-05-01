
export interface ConversationMessage {
  id: string;
  sender: {
    name: string;
    isYou?: boolean;
    avatar?: string;
  };
  content: string;
  date: string;
}

export type TextAlignment = 'text-left' | 'text-center' | 'text-right';

// New type for paper sizes
export type LetterSize = 'a4' | 'a5' | 'a6' | 'b4' | 'b5' | 'b6' | 'custom';

export interface InlineStyle {
  start: number;
  end: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isLink?: boolean;
  linkUrl?: string;
  font?: string;
  size?: string;
  color?: string;
  alignment?: TextAlignment;
}

export interface LetterStyle {
  paperStyle: string;
  borderStyle: string;
  paperSize?: LetterSize; // Added paperSize property
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

// Database-related types for the letters system
export interface Letter {
  id: string;
  sender_id: string;
  recipient_id: string;
  conversation_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  is_favorite: boolean;
  has_attachments: boolean;
  created_at: string;
  updated_at: string;
  documentStyle?: {
    font: string;
    size: string;
    color: string;
    alignment: TextAlignment;
  };
  inlineStyles?: InlineStyle[];
  letterStyle?: LetterStyle;
  sender?: UserProfile;
  recipient?: UserProfile;
}

export interface UserProfile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  created_at?: string;
  unread_count?: number;
  connection_status?: 'pending' | 'accepted' | 'declined' | null;
}

export interface PenPalConnection {
  id: string;
  user_id: string;
  pen_pal_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
  pen_pal?: UserProfile;
}

export interface Interest {
  id: string;
  name: string;
}

export interface UserInterest {
  user_id: string;
  interest_id: string;
  interest?: Interest;
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  updated_at: string;
  participant1?: UserProfile;
  participant2?: UserProfile;
  last_message?: Letter;
  unread_count?: number;
}

