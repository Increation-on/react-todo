import React from "react"
import { useUIStore } from "../store/UIStore"
import { useTaskNotifications } from "../hooks/useTaskNotification.tsx"
import './styles/Task.css'

interface Task {
    id: number | string,
    text: string,
    completed: boolean
}

interface TaskProps {
    task: Task;
    onToggle: (id: number | string) => void;
    onDelete: (id: number | string) => void;             
}

const Task = React.memo(({ task, onToggle, onDelete }: TaskProps) => {
    const { openEditModal } = useUIStore()
    const taskNotify = useTaskNotifications()
    
    const handleToggle = () => {
        onToggle(task.id);
        taskNotify.toggled(task.text, !task.completed);
    };
    
    const handleDelete = () => {
      onDelete(task.id)
    };
    
    return (
        <li className="task">
            <label className="checkbox-container">
                <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={task.completed}
                    onChange={handleToggle}
                />
                <span className="checkbox-custom"></span>
            </label>
            
            <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                {task.text}
            </span>
            
            <div className="task-actions">
                <button
                    onClick={() => openEditModal(task.id, task.text)}
                    className="task-button task-button--edit"
                    title="Edit task"
                >
                    <span>✏️</span>
                    <span className="button-text">Edit</span>
                </button>

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

export default Task