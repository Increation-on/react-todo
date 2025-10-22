/**
 * КОМПОНЕНТ: TaskList (Менеджер задач)
 * Ответственность: хранение состояния, управление списком задач
 * Паттерн: Container Component / State Manager
 */

import Task from "./Task.tsx"
import AddTask from "./AddTask.tsx"
import { useTasksAPI } from '../hooks/useTasksAPI.tsx'
import { useTaskStorage } from '../hooks/useTaskStorage-deleteLater.jsx'
// import { useTaskReducer } from '../hooks/useTaskReducer.jsx'
import { useCallback } from "react"
import { useTaskStore } from "../store/TaskStore.tsx"

const TaskList = () => {
    // 🎯 ПАТТЕРН: State Management
    // const { state, dispatch } = useTaskReducer()

// ✅ ZUSTAND: Получаем состояние и методы из store
    const tasks = useTaskStore(state => state.tasks)
    const addTask = useTaskStore(state => state.addTask)
    const toggleTask = useTaskStore(state => state.toggleTask)
    const deleteTask = useTaskStore(state => state.deleteTask)

    // ✅ HOOK: Синхронизация с localStorage (автосохранение/загрузка)
    // useTaskStorage(state.tasks, dispatch)

    // ✅ HOOK: Загрузка задач из внешнего API
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
        deleteTask(id)
    }, [deleteTask]);

    return (
        <div className="task-list">
            <h2>Tasks List</h2>
            {/* 🎯 КОМПОНЕНТ: Кнопка загрузки из API с состоянием loading */}
            <button onClick={handleLoadFromAPI} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Load Tasks from API'}
            </button>

            {/* ✅ КОМПОНЕНТ: Форма добавления новых задач */}
            <AddTask onAddTask={addTask} />

            {/* 🔄 ПАТТЕРН: Отрисовка списка задач */}
            <ul>
                {tasks.map(task => (
                    // ✅ КОМПОНЕНТ: Отдельная задача с callback функциями
                    <Task
                        key={task.id}          // ⚡ React key для оптимизации списков
                        task={task}            // 📦 Данные задачи (объект)
                        onToggle={handleToggle}      // ✅ Передаём функцию, а не создаём новую
                        onDelete={handleDelete}      // ✅ Передаём функцию, а не создаём новую
                      
                    />
                ))}
            </ul>
        </div>
    )
}

export default TaskList