import React from "react"
import { useUIStore } from "../../store/UIStore.jsx"
import { useTaskNotifications } from "../../hooks/ui/useTaskNotification.tsx"
import './../../styles/Task.css'

// Переименовываем интерфейс, чтобы избежать конфликта имен
interface TaskItem {
    id: number | string,
    text: string,
    completed: boolean,
    priority?: 'high' | 'medium' | 'low' | 'none';
}

interface TaskProps {
    task: TaskItem; // Используем новое имя
    onToggle: (id: number | string) => void;
    onDelete: (id: number | string) => void;             
}

const Task = React.memo(({ task, onToggle, onDelete }: TaskProps) => {
  const { openEditModal } = useUIStore()
  
  const handleToggle = () => {
    onToggle(task.id)
  }
  
  const handleDelete = () => {
    onDelete(task.id);
  };
  
  return (
    <li className="task">
      {/* Кастомный чекбокс */}
      <label className="checkbox-container">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={handleToggle}
        />
        <span className="checkbox-custom"></span>
      </label>
      
      {/* 🔥 ПРИОРИТЕТ - БЕЙДЖ */}
      {task.priority && task.priority !== 'none' && (
        <span className={`task-priority task-priority--${task.priority}`}>
          {task.priority}
        </span>
      )}
      
      {/* Текст задачи */}
      <span className={`task-text ${task.completed ? 'completed' : ''}`}>
        {task.text}
      </span>
      
      {/* Блок действий */}
      <div className="task-actions">
        {/* Кнопка редактирования */}
        <button
          onClick={() => openEditModal(task.id, task.text)}
          className="task-button task-button--edit"
          title="Edit task"
        >
          <span>✏️</span>
          <span className="button-text">Edit</span>
        </button>

        {/* Кнопка удаления */}
        <button 
          onClick={handleDelete}
          className="task-button task-button--delete"
          title="Delete task"
        >
          <span>🗑️</span>
          <span className="button-text">Delete</span>
        </button>
      </div>
    </li>
  )
})

export default Task;