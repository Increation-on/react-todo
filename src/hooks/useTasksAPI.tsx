import { useApi } from './useApi.tsx'
import { useTaskDataManager } from './useTaskDataManager.jsx';

interface Task {
  id: string | number
  text: string
  completed: boolean
}

interface TasksAPIReturn {
  loadTasksFromAPI: () => Promise<Task[]>
  isLoading: boolean
  error: string | null
}

export const useTasksAPI = (tasks: Task[]): TasksAPIReturn => {
    // ✅ HOOKS: Композиция специализированных хуков
    const { isLoading, error, fetchWithState } = useApi<Task[]>(); // Сетевые запросы
    const { processTaskData } = useTaskDataManager() // Обработка данных

    const loadTasksFromAPI = async (): Promise<Task[]> => {
        // ✅ NETWORK: Загрузка данных из внешнего API
        const data = await fetchWithState('https://jsonplaceholder.typicode.com/todos?_limit=3')

        // ✅ PROCESSING: Преобразование и фильтрация данных
        const tasksToAdd = processTaskData(data, tasks)

        return tasksToAdd
    }

    // ✅ INTERFACE: Возвращаем метод загрузки и состояния
    return { loadTasksFromAPI, isLoading, error}
};

// Flow данных:

//1. useApi → загрузка сырых данных

//2. useTaskDataManager → преобразование и фильтрация

//3. useTaskManager → интеграция в состояние приложения