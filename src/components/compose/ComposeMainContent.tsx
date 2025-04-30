
import React from 'react';
import LetterHeader from './LetterHeader';
import ComposeEditor from './ComposeEditor';
import { ComposeViewMode } from '@/components/letter/ComposeViewOption';
import { ConversationMessage } from '@/types/letter';
import ConversationHistory from '@/components/letter/ConversationHistory';

interface ComposeMainContentProps {
  recipient: string;
  subject: string;
  setSubject: (subject: string) => void;
  content: string;
  setContent: (content: string) => void;
  conversation: ConversationMessage[];
  isInConversationContext: boolean;
  handleSend: () => void;
  viewMode: ComposeViewMode;
  isPanelReversed?: boolean;
}

const ComposeMainContent: React.FC<ComposeMainContentProps> = ({
  recipient,
  subject,
  setSubject,
  content,
  setContent,
  conversation,
  isInConversationContext,
  handleSend,
  viewMode,
  isPanelReversed = false
}) => {
  const shouldShowConversation = viewMode === 'side-by-side' && conversation.length > 0;

  return (
    <div className="p-4 flex flex-col h-full overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Compose Letter</h2>
        <LetterHeader 
          recipient={recipient}
          subject={subject}
          setSubject={setSubject}
          isInConversationContext={isInConversationContext}
        />
      </div>
      
      <ComposeEditor
        content={content}
        setContent={setContent}
        subject={subject}
        recipient={recipient}
        handleSend={handleSend}
      />
      
      {/* Show conversation history in mobile view if needed */}
      {shouldShowConversation && (
        <div className="mt-6 space-y-6 lg:hidden">
          <h2 className="text-lg font-semibold">Conversation History</h2>
          <ConversationHistory 
            conversation={conversation}
            showComposeButton={false}
            expandable={true}
          />
        </div>
      )}
    </div>
  );
};

export default ComposeMainContent;
