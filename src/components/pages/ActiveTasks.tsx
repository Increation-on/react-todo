import { useTaskStore } from "../../store/TaskStore.tsx"
import { useMemo, useCallback } from "react"
import Task from "../Task.tsx"


const ActiveTasks = () => {
    // ✅ Получаем задачи из store
    const tasks = useTaskStore(state => state.tasks)
    const toggleTask = useTaskStore(state => state.toggleTask)
    const deleteTask = useTaskStore(state => state.deleteTask)

    // ✅ Фильтруем активные задачи
    const activeTasks = useMemo(() => {
        return tasks.filter(task => !task.completed)
    }, [tasks])

    const handleToggle = useCallback((id: number | string) => {
        toggleTask(id)
    }, [toggleTask]);

    const handleDelete = useCallback((id: number | string) => {
        deleteTask(id)
    }, [deleteTask]);

    return (
        <div className="task-list">
            <ul>
                {tasks && activeTasks.map(task => (
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

export default ActiveTasks