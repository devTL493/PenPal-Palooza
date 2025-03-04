
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Palette } from 'lucide-react';
import { LetterStyle } from '@/pages/Compose';
import { cn } from '@/lib/utils';

// Paper style options
const paperStyleOptions = [
  { value: 'bg-paper', label: 'Classic Cream', description: 'Traditional cream-colored paper' },
  { value: 'bg-white', label: 'Bright White', description: 'Clean, bright white paper' },
  { value: 'bg-blue-50', label: 'Cool Blue', description: 'Subtle blue-tinted paper' },
  { value: 'bg-amber-50', label: 'Warm Amber', description: 'Warm, amber-tinted paper' },
  { value: 'bg-green-50', label: 'Sage Green', description: 'Soft sage green paper' },
  { value: 'bg-pink-50', label: 'Blush Pink', description: 'Light blush pink paper' },
  { value: 'bg-purple-50', label: 'Lavender', description: 'Gentle lavender-tinted paper' },
  { value: 'bg-gradient-to-r from-amber-50 to-yellow-50', label: 'Sunset Gradient', description: 'Warm gradient effect' },
  { value: 'bg-gradient-to-r from-blue-50 to-purple-50', label: 'Ocean Gradient', description: 'Cool blue to purple gradient' },
];

// Border style options
const borderStyleOptions = [
  { value: 'border-none', label: 'None', description: 'No border' },
  { value: 'border border-gray-200', label: 'Simple', description: 'Simple thin border' },
  { value: 'border-2 border-gray-300', label: 'Bold', description: 'Bold border' },
  { value: 'border border-dashed border-gray-300', label: 'Dashed', description: 'Dashed border style' },
  { value: 'border border-dotted border-gray-300', label: 'Dotted', description: 'Dotted border style' },
  { value: 'border-2 border-double border-gray-300', label: 'Double', description: 'Double-line border' },
  { value: 'border-2 border-gray-300 rounded-lg', label: 'Rounded', description: 'Rounded corners with border' },
];

interface PaperStyleSelectorProps {
  letterStyle: LetterStyle;
  setLetterStyle: React.Dispatch<React.SetStateAction<LetterStyle>>;
  paperStylePopoverOpen: boolean;
  setPaperStylePopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaperStyleSelector: React.FC<PaperStyleSelectorProps> = ({
  letterStyle,
  setLetterStyle,
  paperStylePopoverOpen,
  setPaperStylePopoverOpen
}) => {
  const handlePaperStyleSelect = (value: string) => {
    setLetterStyle(prev => ({ ...prev, paperStyle: value }));
  };

  const handleBorderStyleSelect = (value: string) => {
    setLetterStyle(prev => ({ ...prev, borderStyle: value }));
  };

  return (
    <Popover open={paperStylePopoverOpen} onOpenChange={setPaperStylePopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Palette className="h-4 w-4 mr-2" />
          Paper Style
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Tabs defaultValue="paper">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paper">Paper</TabsTrigger>
            <TabsTrigger value="border">Border</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paper" className="space-y-4 mt-4">
            <h3 className="font-medium">Paper Style</h3>
            <div className="grid grid-cols-3 gap-2">
              {paperStyleOptions.map((style) => (
                <div
                  key={style.value}
                  className={cn(
                    "cursor-pointer p-2 h-16 rounded-md flex items-center justify-center text-center text-xs",
                    style.value,
                    letterStyle.paperStyle === style.value ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50"
                  )}
                  onClick={() => handlePaperStyleSelect(style.value)}
                  title={style.description}
                >
                  {style.label}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="border" className="space-y-4 mt-4">
            <h3 className="font-medium">Border Style</h3>
            <div className="grid grid-cols-3 gap-2">
              {borderStyleOptions.map((style) => (
                <div
                  key={style.value}
                  className={cn(
                    "cursor-pointer p-2 h-16 rounded-md flex items-center justify-center text-center text-xs bg-white",
                    style.value,
                    letterStyle.borderStyle === style.value ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50"
                  )}
                  onClick={() => handleBorderStyleSelect(style.value)}
                  title={style.description}
                >
                  {style.label}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default PaperStyleSelector;
