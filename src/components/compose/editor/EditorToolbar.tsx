
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, Type, Grip, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import FormatButton from './FormatButton';
import TextStyleControls from './TextStyleControls';
import SlateColorPickerPopover from '../SlateColorPickerPopover';
import PaperStylePopover from '@/components/letter/PaperStylePopover';
import { LetterStyle } from '@/types/letter';
import { ColorOption } from '@/types/letter';
import { PaperSizeOption } from '@/hooks/usePaperStyle';

interface EditorToolbarProps {
  isToolbarVisible: boolean;
  isToolbarDetached: boolean;
  toolbarPosition: { x: number; y: number };
  toggleToolbarDetached: () => void;
  startDrag: (event: React.PointerEvent) => void;
  colorPickerOpen: boolean;
  setColorPickerOpen: (open: boolean) => void;
  onColorChange: (color: string) => void;
  onRemoveColor: () => void;
  onAddCustomColor: (color: string) => void;
  recentColors: string[];
  colorOptions: ColorOption[];
  paperStylePopoverOpen: boolean;
  setPaperStylePopoverOpen: (open: boolean) => void;
  paperStyleOptions: any[];
  borderStyleOptions: any[];
  letterStyle: LetterStyle;
  updateLetterStyle: (type: 'paperStyle' | 'borderStyle', value: string) => void;
  paperSizeProps: {
    paperSize: string;
    setPaperSize: (size: string) => void;
    paperSizeOptions: PaperSizeOption[];
    customWidth: string;
    setCustomWidth: (width: string) => void;
    customHeight: string;
    setCustomHeight: (height: string) => void;
    isCustomSize: boolean;
    measurementUnit: "mm" | "in";
    setMeasurementUnit: (unit: "mm" | "in") => void;
  };
  stylePopoverOpen: boolean;
  setStylePopoverOpen: (open: boolean) => void;
  // New props for format handling
  activeFormats: Record<string, boolean>;
  onFormatToggle: (format: string) => void;
  // New props for text style controls
  textStyles: {
    fontFamily: string;
    fontSize: string;
    lineSpacing: string;
    alignment: string;
  };
  onFontFamilyChange: (value: string) => void;
  onFontSizeChange: (value: string) => void;
  onLineSpacingChange: (value: string) => void;
  onAlignmentChange: (value: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isToolbarVisible,
  isToolbarDetached,
  toolbarPosition,
  toggleToolbarDetached,
  startDrag,
  colorPickerOpen,
  setColorPickerOpen,
  onColorChange,
  onRemoveColor,
  onAddCustomColor,
  recentColors,
  colorOptions,
  paperStylePopoverOpen,
  setPaperStylePopoverOpen,
  paperStyleOptions,
  borderStyleOptions,
  letterStyle,
  updateLetterStyle,
  paperSizeProps,
  stylePopoverOpen,
  setStylePopoverOpen,
  activeFormats,
  onFormatToggle,
  textStyles,
  onFontFamilyChange,
  onFontSizeChange,
  onLineSpacingChange,
  onAlignmentChange
}) => {
  if (!isToolbarVisible) return null;

  return (
    <div
      className={`${!isToolbarDetached ? 'sticky top-0 w-full' : 'fixed'} z-50 mb-4 rounded-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg border border-gray-100 dark:border-gray-800 py-2 px-4`}
      style={{
        left: isToolbarDetached ? toolbarPosition.x : 'auto',
        top: isToolbarDetached ? toolbarPosition.y : 0,
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        {/* Grip handle */}
        <div
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          onPointerDown={startDrag}
        >
          <Grip size={16} />
        </div>
        
        {/* Detach/attach button */}
        <button
          className={`p-1 rounded text-xs ${isToolbarDetached ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          onClick={toggleToolbarDetached}
          title={isToolbarDetached ? "Attach toolbar" : "Detach toolbar"}
        >
          {isToolbarDetached ? "Attach" : "Detach"}
        </button>
        
        {/* Text formatting controls with updated FormatButton */}
        <FormatButton 
          format="bold" 
          icon={<Bold className="h-4 w-4" />} 
          isActive={activeFormats?.bold || false} 
          onToggle={onFormatToggle}
        />
        <FormatButton 
          format="italic" 
          icon={<Italic className="h-4 w-4" />} 
          isActive={activeFormats?.italic || false} 
          onToggle={onFormatToggle}
        />
        <FormatButton 
          format="underline" 
          icon={<Underline className="h-4 w-4" />} 
          isActive={activeFormats?.underline || false} 
          onToggle={onFormatToggle}
        />
        
        {/* Text style popover with our new component */}
        <Popover open={stylePopoverOpen} onOpenChange={setStylePopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Type className="h-4 w-4 mr-2" />
              Text Style
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <TextStyleControls
              fontFamily={textStyles.fontFamily}
              fontSize={textStyles.fontSize}
              isBold={activeFormats?.bold || false}
              lineSpacing={textStyles.lineSpacing}
              alignment={textStyles.alignment}
              onFontFamilyChange={onFontFamilyChange}
              onFontSizeChange={onFontSizeChange}
              onBoldToggle={() => onFormatToggle('bold')}
              onLineSpacingChange={onLineSpacingChange}
              onAlignmentChange={onAlignmentChange}
            />
          </PopoverContent>
        </Popover>
        
        {/* Color picker */}
        <SlateColorPickerPopover
          colorPickerOpen={colorPickerOpen} 
          setColorPickerOpen={setColorPickerOpen}
          onColorChange={onColorChange}
          onRemoveColor={onRemoveColor}
          onAddCustomColor={onAddCustomColor}
          recentColors={recentColors}
          colorOptions={colorOptions}
        />
        
        {/* Paper style popover */}
        <PaperStylePopover
          paperStylePopoverOpen={paperStylePopoverOpen}
          setPaperStylePopoverOpen={setPaperStylePopoverOpen}
          paperStyleOptions={paperStyleOptions}
          borderStyleOptions={borderStyleOptions}
          letterStyle={letterStyle}
          updateLetterStyle={updateLetterStyle}
          paperSizeProps={{
            paperSize: paperSizeProps.paperSize,
            setPaperSize: paperSizeProps.setPaperSize,
            paperSizeOptions: paperSizeProps.paperSizeOptions,
            customWidth: paperSizeProps.customWidth,
            setCustomWidth: paperSizeProps.setCustomWidth,
            customHeight: paperSizeProps.customHeight,
            setCustomHeight: paperSizeProps.setCustomHeight,
            isCustomSize: paperSizeProps.isCustomSize,
            measurementUnit: paperSizeProps.measurementUnit,
            setMeasurementUnit: paperSizeProps.setMeasurementUnit
          }}
        />
      </div>
    </div>
  );
};

export default EditorToolbar;
