import { useTaskStore } from "../store/TaskStore.tsx"
import { useAuthStore } from "../store/AuthStore.tsx" // 🔥 Добавляем

export const useTaskStats = () => {
    const userId = useAuthStore(state => state.getUserId())
    const allTasks = useTaskStore(state => state.tasks)
    
    // 🔥 Фильтруем задачи текущего пользователя
    const userTasks = allTasks.filter(task => task.userId === userId)

    return {
        total: userTasks.length,
        active: userTasks.filter(t => !t.completed).length,
        completed: userTasks.filter(t => t.completed).length
    }
}