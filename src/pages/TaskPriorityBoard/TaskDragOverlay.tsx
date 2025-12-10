// components/DragOverlay/TaskDragOverlay.tsx
import React from 'react';
import { DragOverlay as DndDragOverlay } from '@dnd-kit/core'
import { Task } from '../../types/task.types.ts'
import './../../styles/TaskDragOverlay.css'

interface TaskDragOverlayProps {
  activeTask: Task | null;
}

export const TaskDragOverlay: React.FC<TaskDragOverlayProps> = ({ activeTask }) => {
  if (!activeTask) return null;
  
  const priorityClass = `task-drag-overlay--${activeTask.priority}`;
  
  return (
    <DndDragOverlay>
      <div className={`task-drag-overlay ${priorityClass}`}>
        <div className="task-drag-overlay__text">
          {activeTask.text}
        </div>
        <div className="task-drag-overlay__priority">
          Приоритет: {activeTask.priority}
        </div>
      </div>
    </DndDragOverlay>
  );
};

TaskDragOverlay.displayName = 'TaskDragOverlay';