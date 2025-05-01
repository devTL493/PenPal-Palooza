
import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from 'lucide-react';
import { PaperStyleOption, BorderStyleOption } from '@/types/letter';
import PaperSizeSelector from './PaperSizeSelector';
import { PaperSizeOption } from '@/hooks/usePaperStyle';

interface PaperStylePopoverProps {
  paperStylePopoverOpen: boolean;
  setPaperStylePopoverOpen: (open: boolean) => void;
  paperStyleOptions: PaperStyleOption[];
  borderStyleOptions: BorderStyleOption[];
  letterStyle: {
    paperStyle: string;
    borderStyle: string;
  };
  updateLetterStyle: (type: 'paperStyle' | 'borderStyle', value: string) => void;
  // Optional paper size props
  paperSizeProps?: {
    paperSize: string;
    setPaperSize: (size: string) => void;
    paperSizeOptions: PaperSizeOption[];
    customWidth: string;
    setCustomWidth: (width: string) => void;
    customHeight: string;
    setCustomHeight: (height: string) => void;
    isCustomSize: boolean;
  };
}

const PaperStylePopover: React.FC<PaperStylePopoverProps> = ({
  paperStylePopoverOpen,
  setPaperStylePopoverOpen,
  paperStyleOptions,
  borderStyleOptions,
  letterStyle,
  updateLetterStyle,
  paperSizeProps
}) => {
  return (
    <Popover open={paperStylePopoverOpen} onOpenChange={setPaperStylePopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Palette className="h-4 w-4 mr-2" />
          Paper Style
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h3 className="font-medium">Paper Style</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Paper Color</label>
            <div className="grid grid-cols-3 gap-2">
              {paperStyleOptions.map((style) => (
                <button
                  key={style.value}
                  onClick={() => updateLetterStyle('paperStyle', style.value)}
                  className={`h-20 rounded border p-1 transition hover:scale-105 ${
                    letterStyle.paperStyle === style.value ? 'ring-2 ring-primary' : ''
                  } ${style.value}`}
                  title={style.description}
                >
                  <div className="h-full w-full flex items-end justify-center pb-1 text-xs font-medium">
                    {style.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Border Style</label>
            <div className="grid grid-cols-3 gap-2">
              {borderStyleOptions.map((style) => (
                <button
                  key={style.value}
                  onClick={() => updateLetterStyle('borderStyle', style.value)}
                  className={`h-12 rounded bg-paper ${style.value} transition hover:scale-105 ${
                    letterStyle.borderStyle === style.value ? 'ring-2 ring-primary' : ''
                  }`}
                  title={style.description}
                >
                  <div className="h-full w-full flex items-center justify-center text-xs font-medium">
                    {style.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Paper size section - only show if props are provided */}
          {paperSizeProps && (
            <div className="border-t pt-4 mt-4">
              <PaperSizeSelector
                paperSize={paperSizeProps.paperSize as any}
                setPaperSize={paperSizeProps.setPaperSize as any}
                paperSizeOptions={paperSizeProps.paperSizeOptions}
                customWidth={paperSizeProps.customWidth}
                setCustomWidth={paperSizeProps.setCustomWidth}
                customHeight={paperSizeProps.customHeight}
                setCustomHeight={paperSizeProps.setCustomHeight}
                isCustomSize={paperSizeProps.isCustomSize}
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PaperStylePopover;
