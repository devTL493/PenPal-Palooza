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
