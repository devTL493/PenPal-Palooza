
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MonitorIcon, SmartphoneIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Navigation from '@/components/Navigation';
import ComposeViewOption, { ComposeViewMode } from '@/components/letter/ComposeViewOption';
import SplitPanelLayout from '@/components/letter/SplitPanelLayout';
import { useAuth } from '@/contexts/AuthContext';
import ComposeMainContent from '@/components/compose/ComposeMainContent';
import useComposeState from '@/hooks/useComposeState';
import ConversationHistory from '@/components/letter/ConversationHistory';

const Compose = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: conversationId } = useParams();
  const { profile } = useAuth();
  
  // States for responsive view
  const [viewMode, setViewMode] = useState<ComposeViewMode>('side-by-side');
  const [isPanelReversed, setIsPanelReversed] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1024);
  
  // Use our custom hook for compose state management
  const composeState = useComposeState({ 
    conversationId, 
    searchParams, 
    profile 
  });
  
  const {
    recipient,
    recipientName,
    recipientProfile,
    subject,
    setSubject,
    content,
    setContent,
    conversation,
    setConversation,
    isInConversationContext,
    handleSend
  } = composeState;

  // Track screen size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to switch panel positions
  const togglePanelPosition = () => {
    setIsPanelReversed(prev => !prev);
  };

  // Check if we should show the conversation
  const shouldShowConversation = viewMode !== 'new-tab' && conversation.length > 0;
  
  // Render the composer panel
  const renderComposerPanel = () => (
    <ComposeMainContent 
      recipient={recipient}
      subject={subject}
      setSubject={setSubject}
      content={content}
      setContent={setContent}
      conversation={conversation}
      isInConversationContext={isInConversationContext}
      handleSend={handleSend}
      viewMode={viewMode}
    />
  );

  // Render the conversation panel
  const renderConversationPanel = () => (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Conversation with {recipientName}</h2>
      
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
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-serif font-medium">
                {isInConversationContext 
                  ? `Correspondence with ${recipientName || "Pen Pal"}` 
                  : "Compose Letter"}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {conversation.length > 0 && (
                <ComposeViewOption
                  currentMode={viewMode}
                  onModeChange={setViewMode}
                  recipientId={recipient}
                />
              )}
              
              {/* Toggle for the responsive view */}
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={isWideScreen ? "default" : "outline"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setIsWideScreen(true)}
                >
                  <MonitorIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Desktop</span>
                </Button>
                <Button
                  variant={!isWideScreen ? "default" : "outline"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setIsWideScreen(false)}
                >
                  <SmartphoneIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Mobile</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Split panel layout for wide screens */}
          {isWideScreen && shouldShowConversation && viewMode === 'side-by-side' ? (
            <SplitPanelLayout
              leftPanel={{
                content: isPanelReversed ? renderConversationPanel() : renderComposerPanel(),
                config: { defaultSize: 40, minSize: 30, maxSize: 70 }
              }}
              rightPanel={{
                content: isPanelReversed ? renderComposerPanel() : renderConversationPanel(),
                config: { defaultSize: 60, minSize: 30, maxSize: 70 }
              }}
              isReversed={isPanelReversed}
              onToggleLayout={togglePanelPosition}
              className="h-[calc(100vh-120px)]"
            />
          ) : (
            <div className="space-y-6">
              {/* Original layout for mobile view */}
              <div className={`${viewMode === 'overlay' && shouldShowConversation ? 'relative' : ''}`}>
                {/* Conversation History (Overlay or side-by-side) */}
                {shouldShowConversation && (viewMode === 'overlay') && (
                  <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
                    <ConversationHistory 
                      conversation={conversation}
                      viewMode={viewMode}
                      showComposeButton={false}
                      expandable={false}
                    />
                  </div>
                )}
                
                {/* Letter Compose Area */}
                <div className={viewMode === 'overlay' ? 'relative z-10' : ''}>
                  {renderComposerPanel()}
                </div>
              </div>
              
              {/* Display conversation messages in side-by-side mode (mobile) */}
              {shouldShowConversation && viewMode === 'side-by-side' && !isWideScreen && (
                <div className="mt-6 space-y-6">
                  <h2 className="text-lg font-semibold">Conversation History</h2>
                  {renderConversationPanel()}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Compose;
