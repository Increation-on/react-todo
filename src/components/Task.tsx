/**
 * КОМПОНЕНТ: Task (Элемент задачи)
 */
import React from "react"
import { useUIStore } from "../store/UIStore"
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
    
    return (
        <li className="task">
            {/* Кастомный чекбокс */}
            <label className="checkbox-container">
                <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                />
                <span className="checkbox-custom"></span>
            </label>
            
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
                    onClick={() => onDelete(task.id)}
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