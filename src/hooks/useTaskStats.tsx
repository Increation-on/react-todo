import { useTaskStore } from "../store/TaskStore.tsx"

export const useTaskStats = () => {

    const tasks = useTaskStore(state => state.tasks)

    return {
        total: tasks.length,
        active: tasks.filter(t => !t.completed).length,
        completed: tasks.filter(t => t.completed).length
    }
}
