import React from 'react';
import { Priority } from './../../types/task.types.ts'
import SortableTask from './SortableTask.tsx';
import './../../styles/PriorityColumn.css'

interface PriorityColumnProps {
  priority: Priority;
  tasks: any[];
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

const PriorityColumn: React.FC<PriorityColumnProps> = ({ priority, tasks }) => {
  return (
    <div className={`priority-column ${priority}`}>
      <div className="column-header">
        <h3>{getPriorityLabel(priority)}</h3>
        <span className="column-counter">{tasks.length}</span>
      </div>
      
      <div>
        {tasks.length === 0 ? (
          <p className="column-empty">ПОКА НЕТ ЗАДАЧ</p>
        ) : (
          tasks.map((task) => (
            <SortableTask key={task.id} task={task} /> // ← используем SortableTask
          ))
        )}
      </div>
    </div>
  );
};

export default PriorityColumn;