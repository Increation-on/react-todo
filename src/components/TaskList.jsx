/**
 * КОМПОНЕНТ: TaskList (Менеджер задач)
 * Ответственность: хранение состояния, управление списком задач
 * Паттерн: Container Component / State Manager
 */

import Task from "./Task"
import AddTask from "./AddTask"
import { useTasksAPI } from '../hooks/useTasksAPI'
import { useTaskStorage } from '../hooks/useTaskStorage'
import { useTaskReducer } from '../hooks/useTaskReducer'

const TaskList = () => {
    // 🎯 ПАТТЕРН: State Management
   
    const {state, dispatch} = useTaskReducer()
   

    // ✅ HOOK: Синхронизация с localStorage (автосохранение/загрузка)
    useTaskStorage(state.tasks, dispatch)

    // ✅ HOOK: Загрузка задач из внешнего API
    const { loadTasksFromAPI, isLoading } = useTasksAPI(
        (taskData)=> dispatch({type: 'ADD_TASK', payload: taskData}),
         state.tasks)

    return (
        <div className="task-list">
            <h2>Tasks List</h2>
            {/* 🎯 КОМПОНЕНТ: Кнопка загрузки из API с состоянием loading */}
            <button onClick={loadTasksFromAPI} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Load Tasks from API'}
            </button>
            
            {/* ✅ КОМПОНЕНТ: Форма добавления новых задач */}
            <AddTask onAddTask={(taskData)=> dispatch({type: 'ADD_TASK', payload: taskData})} />

            {/* 🔄 ПАТТЕРН: Отрисовка списка задач */}
            <ul>
                {state.tasks.map(task => (
                    // ✅ КОМПОНЕНТ: Отдельная задача с callback функциями
                    <Task
                        key={task.id}          // ⚡ React key для оптимизации списков
                        task={task}            // 📦 Данные задачи (объект)
                        onToggle={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}    // 🎮 Функция переключения статуса
                        onDelete={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}    // 🗑️ Функция удаления
                    />
                ))}
            </ul>
        </div>
    )
}

export default TaskList