
import React from 'react';
import { Button } from "@/components/ui/button";
import { Grip } from 'lucide-react';

interface ToolbarDragControlProps {
  startDrag: (event: React.PointerEvent) => void;
  isToolbarDetached: boolean;
  toggleToolbarDetached: () => void;
}

const ToolbarDragControl: React.FC<ToolbarDragControlProps> = ({
  startDrag,
  isToolbarDetached,
  toggleToolbarDetached
}) => {
  return (
    <>
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
    </>
  );
};

export default ToolbarDragControl;
