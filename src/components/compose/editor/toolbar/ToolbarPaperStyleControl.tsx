
import React from 'react';
import PaperStylePopover from '@/components/letter/PaperStylePopover';
import { LetterStyle } from '@/types/letter';
import { PaperSizeOption } from '@/hooks/usePaperStyle';

interface ToolbarPaperStyleControlProps {
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
  handleMouseDown: (e: React.MouseEvent) => void;
}

const ToolbarPaperStyleControl: React.FC<ToolbarPaperStyleControlProps> = ({
  paperStylePopoverOpen,
  setPaperStylePopoverOpen,
  paperStyleOptions,
  borderStyleOptions,
  letterStyle,
  updateLetterStyle,
  paperSizeProps,
  handleMouseDown
}) => {
  return (
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
      // We need to omit the handleMouseDown prop since it doesn't exist in PaperStylePopoverProps
    />
  );
};

export default ToolbarPaperStyleControl;
