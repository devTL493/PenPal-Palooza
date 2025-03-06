
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link as LinkIcon, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LinkPopoverProps {
  linkPopoverOpen: boolean;
  setLinkPopoverOpen: (open: boolean) => void;
  selectionRange: { start: number; end: number } | null;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  linkText: string;
  setLinkText: (text: string) => void;
  onInsertLink: () => void;
}

const LinkPopover: React.FC<LinkPopoverProps> = ({
  linkPopoverOpen,
  setLinkPopoverOpen,
  selectionRange,
  linkUrl,
  setLinkUrl,
  linkText,
  setLinkText,
  onInsertLink
}) => {
  return (
    <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={!selectionRange}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h3 className="font-medium">Insert Link</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">URL</label>
            <Input 
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setLinkPopoverOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={onInsertLink}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Insert Link
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LinkPopover;
