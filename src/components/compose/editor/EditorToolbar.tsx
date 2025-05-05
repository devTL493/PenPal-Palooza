
import React from 'react';
import { Button } from "@/components/ui/button";
import { Grip, X } from 'lucide-react';
import { Popover } from "@/components/ui/popover";
import ToolbarFormatControls from './toolbar/ToolbarFormatControls';
import ToolbarTextStyleControl from './toolbar/ToolbarTextStyleControl';
import ToolbarColorPickerControl from './toolbar/ToolbarColorPickerControl';
import ToolbarPaperStyleControl from './toolbar/ToolbarPaperStyleControl';
import ToolbarDragControl from './toolbar/ToolbarDragControl';
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
  // Format handling
  activeFormats: Record<string, boolean>;
  onFormatToggle: (format: string) => void;
  // Text style controls
  textStyles: {
    fontFamily: string;
    fontSize: string;
    lineSpacing: string;
    alignment: 'left' | 'center' | 'right' | 'justify';
  };
  onFontFamilyChange: (value: string) => void;
  onFontSizeChange: (value: string) => void;
  onLineSpacingChange: (value: string) => void;
  onAlignmentChange: (value: 'left' | 'center' | 'right' | 'justify') => void;
  // Added handleMouseDown prop
  handleMouseDown: (e: React.MouseEvent) => void;
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
  onAlignmentChange,
  handleMouseDown
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
        {/* Toolbar Controls Section */}
        <ToolbarDragControl 
          startDrag={startDrag} 
          isToolbarDetached={isToolbarDetached}
          toggleToolbarDetached={toggleToolbarDetached}
        />
        
        {/* Text formatting controls */}
        <ToolbarFormatControls 
          activeFormats={activeFormats}
          onFormatToggle={onFormatToggle}
        />
        
        {/* Text style popover */}
        <ToolbarTextStyleControl
          stylePopoverOpen={stylePopoverOpen}
          setStylePopoverOpen={setStylePopoverOpen}
          textStyles={textStyles}
          activeFormats={activeFormats}
          onFontFamilyChange={onFontFamilyChange}
          onFontSizeChange={onFontSizeChange}
          onFormatToggle={onFormatToggle}
          onLineSpacingChange={onLineSpacingChange}
          onAlignmentChange={onAlignmentChange}
          handleMouseDown={handleMouseDown}
        />
        
        {/* Color picker */}
        <ToolbarColorPickerControl
          colorPickerOpen={colorPickerOpen}
          setColorPickerOpen={setColorPickerOpen}
          onColorChange={onColorChange}
          onRemoveColor={onRemoveColor}
          onAddCustomColor={onAddCustomColor}
          recentColors={recentColors}
          colorOptions={colorOptions}
          handleMouseDown={handleMouseDown}
        />
        
        {/* Paper style popover */}
        <ToolbarPaperStyleControl
          paperStylePopoverOpen={paperStylePopoverOpen}
          setPaperStylePopoverOpen={setPaperStylePopoverOpen}
          paperStyleOptions={paperStyleOptions}
          borderStyleOptions={borderStyleOptions}
          letterStyle={letterStyle}
          updateLetterStyle={updateLetterStyle}
          paperSizeProps={paperSizeProps}
          handleMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
};

export default EditorToolbar;
