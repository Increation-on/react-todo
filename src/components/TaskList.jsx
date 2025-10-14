/**
 * КОМПОНЕНТ: TaskList (Менеджер задач)
 * Ответственность: хранение состояния, управление списком задач
 * Паттерн: Container Component / State Manager
 */

import { useState, useEffect } from 'react'
import Task from "./Task"
import AddTask from "./AddTask"
import { useTasksAPI } from '../hooks/useTasksAPI'
import { useTaskStorage } from '../hooks/useTaskStorage'
import { useTaskManager } from '../hooks/useTaskManager'



const TaskList = () => {
    // 🎯 ПАТТЕРН: State Management
    // useState - аналог let tasks = [], но с реактивностью
    const [tasks, setTasks] = useState([])

    // ✅ HOOK: Синхронизация с localStorage (автосохранение/загрузка)
    useTaskStorage(tasks, setTasks)

    // ✅ HOOK: Управление операциями с задачами (добавление/удаление/переключение)
    const {onAddTask, onDelete, onToggle} = useTaskManager(setTasks)

    // ✅ HOOK: Загрузка задач из внешнего API
    const { loadTasksFromAPI, isLoading } = useTasksAPI(onAddTask, tasks)


    return (
        <div className="task-list">
            <h2>Tasks List</h2>
            {/* 🎯 КОМПОНЕНТ: Кнопка загрузки из API с состоянием loading */}
            <button onClick={loadTasksFromAPI} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Load Tasks from API'}
            </button>
            
            {/* ✅ КОМПОНЕНТ: Форма добавления новых задач */}
            <AddTask onAddTask={onAddTask} />

            {/* 🔄 ПАТТЕРН: Отрисовка списка задач */}
            <ul>
                {tasks.map(task => (
                    // ✅ КОМПОНЕНТ: Отдельная задача с callback функциями
                    <Task
                        key={task.id}          // ⚡ React key для оптимизации списков
                        task={task}            // 📦 Данные задачи (объект)
                        onToggle={onToggle}    // 🎮 Функция переключения статуса
                        onDelete={onDelete}    // 🗑️ Функция удаления
                    />
                ))}
            </ul>
        </div>
    )
}

export default TaskList