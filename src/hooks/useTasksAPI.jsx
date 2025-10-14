import { useApi } from './useApi'
import { useTaskDataManager } from './useTaskDataManager';

export const useTasksAPI = (onAddTask, tasks) => {
    // ✅ HOOKS: Композиция специализированных хуков
    const { isLoading, error, fetchWithState } = useApi(); // Сетевые запросы
    const { processTaskData } = useTaskDataManager() // Обработка данных

    const loadTasksFromAPI = async () => {
        // ✅ NETWORK: Загрузка данных из внешнего API
        const data = await fetchWithState('https://jsonplaceholder.typicode.com/todos?_limit=3')

        // ✅ PROCESSING: Преобразование и фильтрация данных
        const tasksToAdd = processTaskData(data, tasks)

        // ✅ INTEGRATION: Добавление обработанных задач в приложение
        tasksToAdd.forEach(task => {
            onAddTask(task); // Используем существующую функцию из TaskManager
        });
    }

    // ✅ INTERFACE: Возвращаем метод загрузки и состояния
    return { loadTasksFromAPI, isLoading, error }
};

// Flow данных:

//1. useApi → загрузка сырых данных

//2. useTaskDataManager → преобразование и фильтрация

//3. useTaskManager → интеграция в состояние приложения