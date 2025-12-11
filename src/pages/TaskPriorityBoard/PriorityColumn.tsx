import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Priority } from './../../types/task.types.ts';
import SortableTask from './SortableTask.tsx';
import './../../styles/PriorityColumn.css';

interface PriorityColumnProps {
  priority: Priority;
  tasks: any[];
  isDragOver?: boolean;
  isMobile?: boolean;
  onMoveTask?: (taskId: string | number, newPriority: Priority) => void; // 🆕 Добавляем
}

const getPriorityLabel = (priority: Priority): string => {
  const labels = {
    high: '🔥 HIGH',
    medium: '⚡ MEDIUM',
    low: '🌱 LOW',
    none: '📋 NON-PRIORITY',
  };
  return labels[priority];
};

const PriorityColumn: React.FC<PriorityColumnProps> = ({ 
  priority, 
  tasks, 
  isDragOver = false,
  isMobile = false,
  onMoveTask // 🆕 Получаем
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-drop-${priority}`,
    data: {
      type: 'column',
      priority: priority,
      columnId: `column-${priority}`
    }
  });

  return (
    <div className={`priority-column ${priority} ${isDragOver ? 'column-drag-over' : ''}`}>
      <div className="column-header">
        <h3>{getPriorityLabel(priority)}</h3>
        <span className="column-counter">{tasks.length}</span>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`column-drop-zone ${isOver ? 'column-drag-over' : ''}`}
        style={{ 
          minHeight: tasks.length === 0 ? '100px' : 'auto',
          flex: 1
        }}
      >
        {tasks.length === 0 ? (
          <p className="column-empty">Tasks field is empty...</p>
        ) : (
          tasks.map((task, index) => (
            <SortableTask 
              key={task.id} 
              task={task} 
              index={index} 
              isMobile={isMobile}
              onPriorityChange={onMoveTask} // 🆕 Передаем дальше
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PriorityColumn;