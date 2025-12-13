import { useTaskStore } from "../store/TaskStore.tsx"
import { useAuthStore } from "../store/AuthStore.tsx"
import { useMemo, useCallback } from "react"
import Task from './../components/tasks/Task.tsx'
import { usePriorityTasks } from "../hooks/tasks/usePriorityTasks.tsx"
import './../styles/TaskList.css'


const CompletedTasks = () => {
    // ✅ Получаем userId
    const userId = useAuthStore(state => state.getUserId())
    
    // ✅ Получаем задачи
    const {sortedTasks} = usePriorityTasks()
    const toggleTask = useTaskStore(state => state.toggleTask)
    const deleteTask = useTaskStore(state => state.deleteTask)

    // ✅ Фильтруем СНАЧАЛА по userId, ПОТОМ по completed
    const completedTasks = useMemo(() => {
        const userTasks = sortedTasks.filter(task => task.userId === userId)
        return userTasks.filter(task => task.completed)
    }, [sortedTasks, userId]) // 🔥 Добавляем userId

    const handleToggle = useCallback((id: number | string) => {
        toggleTask(id)
    }, [toggleTask])

    const handleDelete = useCallback((id: number | string) => {
        deleteTask(id)
    }, [deleteTask])

    return (
        <div className="task-list">
           {completedTasks.length !== 0 ? 
           <ul>
                {completedTasks.map(task => ( // 🔥 Меняем tasks на completedTasks
                    <Task
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                    />
                ))}
            </ul>
           : <div className="empty-list">Completed tasks not found</div>} 
        </div>
    )
}

export default CompletedTasks