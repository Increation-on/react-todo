/**
 * КОМПОНЕНТ: TaskList (Менеджер задач)
 * Ответственность: хранение состояния, управление списком задач
 * Паттерн: Container Component / State Manager
 */

import Task from "./Task.tsx"
import AddTask from "./AddTask.tsx"
import { useTasksAPI } from '../hooks/useTasksAPI.tsx'
import { useTaskStorage } from '../hooks/useTaskStorage.jsx'
import { useTaskReducer } from '../hooks/useTaskReducer.jsx'
import { useCallback } from "react"

const TaskList = () => {
    // 🎯 ПАТТЕРН: State Management
    const { state, dispatch } = useTaskReducer()


    // ✅ HOOK: Синхронизация с localStorage (автосохранение/загрузка)
    useTaskStorage(state.tasks, dispatch)

    // ✅ HOOK: Загрузка задач из внешнего API
    const { loadTasksFromAPI, isLoading } = useTasksAPI(state.tasks)

    const handleLoadFromAPI = async () => {
    try {
        const tasksToAdd = await loadTasksFromAPI()
        tasksToAdd.forEach(task => {
            dispatch({ type: 'ADD_TASK', payload: task })
        })
    } catch (error) {
        console.error('Failed to load tasks:', error)
    }
}

    const handleToggle = useCallback((id: number | string) => {
        dispatch({ type: 'TOGGLE_TASK', payload: id });
    }, [dispatch]);

    const handleDelete = useCallback((id: number | string) => {
        dispatch({ type: 'DELETE_TASK', payload: id });
    }, [dispatch]);

    return (
        <div className="task-list">
            <h2>Tasks List</h2>
            {/* 🎯 КОМПОНЕНТ: Кнопка загрузки из API с состоянием loading */}
            <button onClick={handleLoadFromAPI} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Load Tasks from API'}
            </button>

            {/* ✅ КОМПОНЕНТ: Форма добавления новых задач */}
            <AddTask onAddTask={(taskData) => dispatch({ type: 'ADD_TASK', payload: taskData })} />

            {/* 🔄 ПАТТЕРН: Отрисовка списка задач */}
            <ul>
                {state.tasks.map(task => (
                    // ✅ КОМПОНЕНТ: Отдельная задача с callback функциями
                    <Task
                        key={task.id}          // ⚡ React key для оптимизации списков
                        task={task}            // 📦 Данные задачи (объект)
                        onToggle={handleToggle}      // ✅ Передаём функцию, а не создаём новую
                        onDelete={handleDelete}      // ✅ Передаём функцию, а не создаём новую
                        taskId={task.id}      // 🗑️ Функция удаления
                    />
                ))}
            </ul>
        </div>
    )
}

export default TaskList