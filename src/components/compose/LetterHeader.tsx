
import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { samplePenPals } from '@/data/sampleData';

interface LetterHeaderProps {
  recipient: string;
  subject: string;
  setSubject: (subject: string) => void;
  isInConversationContext: boolean;
}

const LetterHeader: React.FC<LetterHeaderProps> = ({
  recipient,
  subject,
  setSubject,
  isInConversationContext
}) => {
  if (isInConversationContext) {
    return null;
  }

  return (
    <div className="space-y-4 mb-4">
      <div>
        <Select value={recipient}>
          <SelectTrigger id="recipient">
            <SelectValue placeholder="Select recipient..." />
          </SelectTrigger>
          <SelectContent>
            {samplePenPals.map((penpal) => (
              <SelectItem key={penpal.id} value={penpal.id}>
                {penpal.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Input
          id="subject"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="font-medium"
        />
      </div>
    </div>
  );
};

export default LetterHeader;
