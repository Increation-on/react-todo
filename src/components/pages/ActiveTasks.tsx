import { useTaskStore } from "../../store/TaskStore.tsx"
import { useAuthStore } from "../../store/AuthStore.tsx"
import { useMemo, useCallback } from "react"
import Task from "../Task.tsx"

const ActiveTasks = () => {
    // ✅ Получаем userId
    const userId = useAuthStore(state => state.getUserId())
    
    // ✅ Получаем задачи из store
    const allTasks = useTaskStore(state => state.tasks)
    const toggleTask = useTaskStore(state => state.toggleTask)
    const deleteTask = useTaskStore(state => state.deleteTask)

    // ✅ Фильтруем СНАЧАЛА по userId, ПОТОМ по активным
    const activeTasks = useMemo(() => {
        const userTasks = allTasks.filter(task => task.userId === userId)
        return userTasks.filter(task => !task.completed)
    }, [allTasks, userId]) // 🔥 ДОБАВИЛИ userId в зависимости

    const handleToggle = useCallback((id: number | string) => {
        toggleTask(id)
    }, [toggleTask])

    const handleDelete = useCallback((id: number | string) => {
        deleteTask(id)
    }, [deleteTask])

    return (
        <div className="task-list">
            <ul>
                {activeTasks.map(task => ( // 🔥 МЕНЯЕМ tasks на activeTasks
                    <Task
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                    />
                ))}
            </ul>
        </div>
    )
}

export default ActiveTasks