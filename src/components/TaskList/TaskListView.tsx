// components/TaskList/TaskListView.tsx
import React from 'react';
import Task from '../Task.tsx';
import { TaskListViewTask } from '../../types/task.types';

interface TaskListViewProps {
  tasks: TaskListViewTask[];
  onToggle: (id: string | number) => void;
  onDelete: (id: string | number) => void;
  isEmpty?: boolean;
}

const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onToggle,
  onDelete,
  isEmpty = false
}) => {
  if (isEmpty) {
    return (
      <div className="empty-list">
        <div className="empty-list-icon">📋</div>
        <p>No tasks found. Try a different search or add a new task!</p>
      </div>
    );
  }

  return (
    <ul className="task-list" >
      {tasks.map(task => (
        <Task
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TaskListView;