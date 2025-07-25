import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface DroppableTimeSlotProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function DroppableTimeSlot({ id, children, className = "" }: DroppableTimeSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const style = {
    backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : undefined,
    borderColor: isOver ? 'rgb(59, 130, 246)' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`h-16 transition-colors ${className}`}
    >
      {children}
    </div>
  );
}