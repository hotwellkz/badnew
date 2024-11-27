import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableCategoryProps {
  id: string;
  children: React.ReactNode;
  status: 'building' | 'deposit' | 'built';
}

export const DroppableCategory: React.FC<DroppableCategoryProps> = ({
  id,
  children,
  status
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { status }
  });

  return (
    <div
      ref={setNodeRef}
      className={`space-y-2 transition-colors ${
        isOver ? 'bg-gray-100 rounded-lg p-2' : ''
      }`}
    >
      {children}
    </div>
  );
};