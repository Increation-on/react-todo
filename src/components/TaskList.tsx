/**
 * КОМПОНЕНТ: TaskList (Менеджер задач)
 * Ответственность: хранение состояния, управление списком задач
 * Паттерн: Container Component / State Manager
 */
import Task from "./Task.tsx"
import AddTask from "./AddTask.tsx"
import { useTasksAPI } from '../hooks/useTasksAPI.tsx'
import { useCallback } from "react"
import { useTaskStore } from "../store/TaskStore.tsx"
import { useAuthStore } from "../store/AuthStore.tsx"
import './styles/TaskList.css'

const TaskList = () => {
    const userId = useAuthStore(state => state.getUserId())
    const getUserTasks = useTaskStore(state => state.getUserTasks)
    const tasks = getUserTasks(userId)
    const addTask = useTaskStore(state => state.addTask)
    const toggleTask = useTaskStore(state => state.toggleTask)
    const deleteTask = useTaskStore(state => state.deleteTask)

    const { loadTasksFromAPI, isLoading } = useTasksAPI(tasks)

    const handleLoadFromAPI = async () => {
        try {
            const tasksToAdd = await loadTasksFromAPI()
            tasksToAdd.forEach(task => {
                addTask(task.text)
            })
        } catch (error) {
            console.error('Failed to load tasks:', error)
        }
    }

    const handleToggle = useCallback((id: number | string) => {
        toggleTask(id)
    }, [toggleTask]);

    const handleDelete = useCallback((id: number | string) => {
        if (window.confirm('Вы уверены что хотите удалить задачу?')) {
            deleteTask(id);
        }
    }, [deleteTask]);

    return (
        <div className="task-list-container">
            <h2 className="task-list-title">Tasks List</h2>
            
            {/* 🎯 КОМПОНЕНТ: Кнопка загрузки из API */}
            <button 
                onClick={handleLoadFromAPI} 
                disabled={isLoading}
                className="list-control-button"
                style={{ marginBottom: '1rem' }}
            >
                {isLoading ? 'Loading...' : 'Load Tasks from API'}
            </button>

            {/* ✅ КОМПОНЕНТ: Форма добавления новых задач */}
            <AddTask onAddTask={addTask} />

            {/* 🔄 ПАТТЕРН: Отрисовка списка задач */}
            {tasks.length === 0 ? (
                <div className="empty-list">
                    <div className="empty-list-icon">📋</div>
                    <p>No tasks yet. Add your first task!</p>
                </div>
            ) : (
                <ul className="task-list">
                    {tasks.map(task => (
                        <Task
                            key={task.id}
                            task={task}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

export default TaskList