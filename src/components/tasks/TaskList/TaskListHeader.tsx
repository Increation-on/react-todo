// components/TaskList/TaskListHeader.tsx
import React from 'react';

interface TaskListHeaderProps {
  isLoading: boolean;
  onLoadFromAPI: () => Promise<void>;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({
  isLoading,
  onLoadFromAPI
}) => {
  return (
    <div className="task-list-header">
      <h2 className="task-list-title">Tasks List</h2>
      
      <button 
        onClick={onLoadFromAPI}
        disabled={isLoading}
        className="list-control-button"
        aria-label="Load example tasks from API"
      >
        {isLoading ? 'Loading...' : 'Load Tasks from API'}
      </button>
    </div>
  );
};

export default TaskListHeader;