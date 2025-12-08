import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Priority } from './../../types/task.types.ts'

interface SortableTaskProps {
  task: {
    id: number | string;
    text: string;
    priority: Priority;
  };
}

const SortableTask: React.FC<SortableTaskProps> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id.toString(),
    data: {
      type: 'task',
      priority: task.priority,
      task
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${task.priority} ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="task-text">
        {task.text}
        {isDragging && <span style={{ color: '#ff00ff', marginLeft: '8px' }}>🌀</span>}
      </div>
    </div>
  );
};

export default SortableTask;