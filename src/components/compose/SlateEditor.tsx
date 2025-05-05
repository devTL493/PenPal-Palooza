
import React from 'react';
import { Slate } from 'slate-react';
import { TextAlignment, LetterStyle } from '@/types/letter';
import { usePaperStyle } from '@/hooks/usePaperStyle';
import './slateEditor.css';

// Import refactored components and hooks
import EditorToolbar from './editor/EditorToolbar';
import EditorFooter from './editor/EditorFooter';
import SlateEditorCanvas from './editor/SlateEditorCanvas';
import { useToolbarControls } from './editor/useToolbarControls';
import { useSlateEditorCore } from './editor/useSlateEditorCore';
import { useSlateEditor } from './editor/SlateHooks';
import { useElementRenderers } from './editor/useElementRenderers';
import { useTextFormatControls } from './editor/useTextFormatControls';

interface SlateEditorProps {
  content: string;
  setContent: (content: string) => void;
  documentStyle: {
    font: string;
    size: string;
    color: string;
    alignment: TextAlignment;
  };
  letterStyle: LetterStyle;
  updateLetterStyle: (type: 'paperStyle' | 'borderStyle', value: string) => void;
  paperStyleOptions: any[];
  borderStyleOptions: any[];
  fontOptions: any[];
  fontSizeOptions: any[];
  colorOptions: any[];
  applyFormatting: (formatType: string, value: any) => void;
  insertLink: () => void;
  handleAutoSave: () => void;
}

const SlateEditor: React.FC<SlateEditorProps> = ({
  content,
  setContent,
  documentStyle,
  letterStyle,
  updateLetterStyle,
  paperStyleOptions,
  borderStyleOptions,
  fontOptions,
  fontSizeOptions,
  colorOptions,
  applyFormatting,
  insertLink,
  handleAutoSave,
}) => {
  // Paper style settings
  const paperSizeProps = usePaperStyle();
  const { getPaperDimensions } = paperSizeProps;
  const dimensions = getPaperDimensions();

  // Toolbar controls
  const toolbarControls = useToolbarControls();

  // Editor core functionality
  const editorCore = useSlateEditorCore({
    content,
    setContent,
    handleAutoSave,
    dimensions
  });

  // Element renderers
  const { renderElement, renderLeaf } = useElementRenderers({
    letterStyle,
    dimensions
  });

  // Text formatting controls
  const textFormatControls = useTextFormatControls({
    editor: editorCore.editor
  });

  // Get all editor utilities from our custom hook
  const slateEditorUtils = useSlateEditor(editorCore.editor, editorCore.pageHeight);

  return (
    <div 
      className="flex flex-col items-center" 
      onMouseMove={toolbarControls.handleMouseMove}
      ref={editorCore.editorRef}
    >
      <Slate
        editor={editorCore.editor}
        value={editorCore.slateValue}
        onChange={editorCore.handleChange}
      >
        {/* Editor Toolbar */}
        <EditorToolbar
          isToolbarVisible={toolbarControls.isToolbarVisible}
          isToolbarDetached={toolbarControls.isToolbarDetached}
          toolbarPosition={toolbarControls.toolbarPosition}
          toggleToolbarDetached={toolbarControls.toggleToolbarDetached}
          startDrag={toolbarControls.startDrag}
          colorPickerOpen={slateEditorUtils.colorPickerOpen}
          setColorPickerOpen={(open) => {
            if (open) slateEditorUtils.saveCurrentSelection();
            slateEditorUtils.setColorPickerOpen(open);
          }}
          onColorChange={slateEditorUtils.handleColorChange}
          onRemoveColor={slateEditorUtils.handleRemoveColor}
          onAddCustomColor={slateEditorUtils.handleColorChange}
          recentColors={slateEditorUtils.recentColors}
          colorOptions={colorOptions}
          paperStylePopoverOpen={slateEditorUtils.paperStylePopoverOpen}
          setPaperStylePopoverOpen={(open) => {
            if (open) slateEditorUtils.saveCurrentSelection();
            slateEditorUtils.setPaperStylePopoverOpen(open);
          }}
          paperStyleOptions={paperStyleOptions}
          borderStyleOptions={borderStyleOptions}
          letterStyle={letterStyle}
          updateLetterStyle={updateLetterStyle}
          paperSizeProps={paperSizeProps}
          stylePopoverOpen={slateEditorUtils.stylePopoverOpen}
          setStylePopoverOpen={(open) => {
            if (open) slateEditorUtils.saveCurrentSelection();
            slateEditorUtils.setStylePopoverOpen(open);
          }}
          activeFormats={textFormatControls.activeFormats}
          onFormatToggle={textFormatControls.handleFormatToggle}
          textStyles={textFormatControls.textStyles}
          onFontFamilyChange={textFormatControls.handleFontFamilyChange}
          onFontSizeChange={textFormatControls.handleFontSizeChange}
          onLineSpacingChange={textFormatControls.handleLineSpacingChange}
          onAlignmentChange={textFormatControls.handleAlignmentChange}
          handleMouseDown={slateEditorUtils.handleMouseDown}
        />
        
        {/* Canvas with scroll snap */}
        <SlateEditorCanvas
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          handleKeyDown={slateEditorUtils.handleKeyDown}
          handlePasteWithPagination={slateEditorUtils.handlePasteWithPagination}
          zoom={slateEditorUtils.zoom}
          canvasRef={editorCore.canvasRef}
        />
        
        {/* Editor Footer */}
        <EditorFooter
          wordCount={editorCore.wordCount}
          pageCount={editorCore.pageCount}
          zoom={slateEditorUtils.zoom}
          handleZoomChange={slateEditorUtils.handleZoomChange}
        />
      </Slate>
    </div>
  );
};

export default SlateEditor;
