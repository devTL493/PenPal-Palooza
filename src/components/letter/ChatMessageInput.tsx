
import React, { RefObject } from 'react';
import { Button } from "@/components/ui/button";
import { Send, Save, Clock } from 'lucide-react';
import { FontOption, FontSizeOption, ColorOption } from '@/types/letter';

interface ChatMessageInputProps {
  content: string;
  setContent: (content: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
  selectionRange: { start: number; end: number } | null;
  activeTextFormat: any; // Using 'any' as this is just passed through
  fontOptions: FontOption[];
  fontSizeOptions: FontSizeOption[];
  colorOptions: ColorOption[];
  stylePopoverOpen: boolean;
  setStylePopoverOpen: (open: boolean) => void;
  applyFormatting: (formatType: string, value: any) => void;
  handleSend: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
  handleAutoSave?: () => void;
  formatLastSaved?: () => string;
}

const ChatMessageInput: React.FC<ChatMessageInputProps> = ({
  content,
  setContent,
  textareaRef,
  handleSend,
  isSaving,
  lastSaved,
  handleAutoSave,
  formatLastSaved
}) => {
  return (
    <div className="border-t border-border pt-4 flex flex-wrap justify-between gap-2 mt-4">
      <div className="flex items-center text-sm text-muted-foreground">
        {isSaving ? (
          <span className="flex items-center">
            <Clock className="animate-pulse h-4 w-4 mr-2" />
            Saving...
          </span>
        ) : lastSaved && formatLastSaved ? (
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {formatLastSaved()}
          </span>
        ) : null}
      </div>
      
      <div className="flex gap-2">
        {handleAutoSave && (
          <Button variant="outline" onClick={handleAutoSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        )}
        <Button onClick={handleSend}>
          <Send className="h-4 w-4 mr-2" />
          Send Letter
        </Button>
      </div>
    </div>
  );
};

export default ChatMessageInput;
