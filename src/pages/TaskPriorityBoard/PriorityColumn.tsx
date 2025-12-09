// PriorityColumn.tsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Priority } from './../../types/task.types.ts'
import SortableTask from './SortableTask.tsx';
import './../../styles/PriorityColumn.css'

interface PriorityColumnProps {
  priority: Priority;
  tasks: any[];
   isDragOver?: boolean;
}

const getPriorityLabel = (priority: Priority): string => {
  const labels = {
    high: '🔥 ВЫСОКИЙ',
    medium: '⚡ СРЕДНИЙ',
    low: '🌱 НИЗКИЙ',
    none: '📋 БЕЗ ПРИОРИТЕТА',
  };
  return labels[priority];
};

const PriorityColumn: React.FC<PriorityColumnProps> = ({ priority, tasks,  isDragOver = false  }) => {
  // 🔥 СОЗДАЕМ ОТДЕЛЬНЫЙ DROPPABLE ДЛЯ ПУСТОЙ ОБЛАСТИ
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
      
      {/* 🔥 ЭТОТ DIV БУДЕТ ПРИНИМАТЬ ЗАДАЧИ В ПУСТУЮ ОБЛАСТЬ */}
      <div 
        ref={setNodeRef}
        className={`column-drop-zone ${isOver ? 'column-drag-over' : ''}`}
        style={{ 
          minHeight: tasks.length === 0 ? '100px' : 'auto',
          flex: 1
        }}
      >
        {tasks.length === 0 ? (
          <p className="column-empty">ПОКА НЕТ ЗАДАЧ</p>
        ) : (
          // 🔥 ЗАДАЧИ РЕНДЕРЯТСЯ КАК ОБЫЧНО
          tasks.map((task, index) => (
            <SortableTask key={task.id} task={task} index={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default PriorityColumn;