
import React from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SplitPanelLayout from '@/components/letter/SplitPanelLayout';
import { useAuth } from '@/contexts/AuthContext';
import ComposeMainContent from '@/components/compose/ComposeMainContent';
import useComposeState from '@/hooks/useComposeState';
import ConversationHistory from '@/components/letter/ConversationHistory';
import ComposeHeader from '@/components/compose/ComposeHeader';
import ComposeMobileLayout from '@/components/compose/ComposeMobileLayout';
import { useComposeView } from '@/hooks/useComposeView';
import ComposeEditor from '@/components/compose/ComposeEditor';

const Compose = () => {
  const [searchParams] = useSearchParams();
  const { id: conversationId } = useParams();
  const { profile } = useAuth();
  
  // Use our custom hooks for compose state and view management
  const composeState = useComposeState({ 
    conversationId, 
    searchParams, 
    profile 
  });
  
  const {
    recipient,
    recipientName,
    subject,
    setSubject,
    content,
    setContent,
    conversation,
    isInConversationContext,
    handleSend
  } = composeState;

  const {
    viewMode,
    setViewMode,
    isPanelReversed,
    isWideScreen,
    setIsWideScreen,
    togglePanelPosition
  } = useComposeView();

  // Always force conversation to be visible if it exists
  const shouldShowConversation = conversation && conversation.length > 0;
  
  // Render the composer panel with enhanced paper editor
  const renderComposerPanel = () => (
    <div className="h-full overflow-visible flex flex-col">
      <div className="flex-1 overflow-visible">
        <ComposeEditor 
          content={content}
          setContent={setContent}
          subject={subject}
          recipient={recipient}
          handleSend={handleSend}
        />
      </div>
    </div>
  );

  // Render the conversation panel
  const renderConversationPanel = () => (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Conversation with {recipientName || "Pen Pal"}</h2>
        {/* Move panel swap button here for better positioning */}
        <Button 
          variant="outline"
          size="sm"
          onClick={togglePanelPosition}
          title="Switch panel positions"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
      </div>
      
      <ConversationHistory 
        conversation={conversation}
        viewMode={viewMode}
        showComposeButton={false}
        expandable={true}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="w-full px-4 pt-24 pb-16">
        <div className="w-full max-w-screen-2xl mx-auto">
          <ComposeHeader 
            recipientName={recipientName}
            isInConversationContext={isInConversationContext}
            conversation={conversation}
            isWideScreen={isWideScreen}
            viewMode={viewMode}
            setViewMode={setViewMode}
            setIsWideScreen={setIsWideScreen}
            togglePanelPosition={togglePanelPosition}
            isPanelReversed={isPanelReversed}
            recipient={recipient}
          />
          
          {/* Split panel layout for wide screens */}
          {isWideScreen && shouldShowConversation && viewMode === 'side-by-side' ? (
            <SplitPanelLayout
              leftPanel={{
                content: isPanelReversed ? renderConversationPanel() : renderComposerPanel(),
                config: { defaultSize: isPanelReversed ? 30 : 70, minSize: 25, maxSize: 75 }
              }}
              rightPanel={{
                content: isPanelReversed ? renderComposerPanel() : renderConversationPanel(),
                config: { defaultSize: isPanelReversed ? 70 : 30, minSize: 25, maxSize: 75 }
              }}
              isReversed={isPanelReversed}
              onToggleLayout={togglePanelPosition}
              className="h-[calc(100vh-160px)]"
              toggleButtonPosition="bottom"
            />
          ) : (
            <ComposeMobileLayout 
              viewMode={viewMode}
              renderComposerPanel={renderComposerPanel}
              conversation={conversation}
              shouldShowConversation={shouldShowConversation}
              togglePanelPosition={togglePanelPosition}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Compose;
