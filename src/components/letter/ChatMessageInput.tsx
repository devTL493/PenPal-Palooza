
import React, { useState, useRef, KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image, PaperclipIcon } from 'lucide-react';
import TextFormattingToolbar from './TextFormattingToolbar';
import { InlineStyle, TextAlignment } from '@/types/letter';

interface ChatMessageInputProps {
  content: string;
  setContent: (content: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  selectionRange: { start: number; end: number } | null;
  activeTextFormat: {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    font: string;
    size: string;
    color: string;
    alignment: TextAlignment;
  };
  fontOptions: any[];
  fontSizeOptions: any[];
  colorOptions: any[];
  stylePopoverOpen: boolean;
  setStylePopoverOpen: (open: boolean) => void;
  applyFormatting: (formatType: string, value: any) => void;
  handleSend: () => void;
}

const ChatMessageInput: React.FC<ChatMessageInputProps> = ({
  content,
  setContent,
  textareaRef,
  selectionRange,
  activeTextFormat,
  fontOptions,
  fontSizeOptions,
  colorOptions,
  stylePopoverOpen,
  setStylePopoverOpen,
  applyFormatting,
  handleSend
}) => {
  // Send message on Ctrl+Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative bg-background rounded-lg border shadow-sm">
      <div className="border-b p-2 flex items-center gap-2">
        <TextFormattingToolbar
          selectionRange={selectionRange}
          activeTextFormat={activeTextFormat}
          fontOptions={fontOptions}
          fontSizeOptions={fontSizeOptions}
          colorOptions={colorOptions}
          stylePopoverOpen={stylePopoverOpen}
          setStylePopoverOpen={setStylePopoverOpen}
          applyFormatting={applyFormatting}
        />
      </div>
      
      <Textarea
        ref={textareaRef}
        placeholder="Write your letter here... (Ctrl+Enter to send)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`min-h-[150px] resize-none border-0 focus-visible:ring-0 ${activeTextFormat.font}`}
      />
      
      <div className="p-2 flex justify-between items-center border-t">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="Attach file">
            <PaperclipIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Add image">
            <Image className="h-4 w-4" />
          </Button>
        </div>
        
        <Button onClick={handleSend} className="gap-2">
          <Send className="h-4 w-4" /> Send
        </Button>
      </div>
    </div>
  );
};

export default ChatMessageInput;
