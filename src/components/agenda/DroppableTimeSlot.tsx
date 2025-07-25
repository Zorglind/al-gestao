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
    backgroundColor: isOver ? 'hsl(var(--primary) / 0.1)' : undefined,
    borderColor: isOver ? 'hsl(var(--primary))' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`transition-colors ${className}`}
    >
      {children}
    </div>
  );
}