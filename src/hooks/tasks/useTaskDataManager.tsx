interface ApiTask {
  id: number | string;    // ID задачи из API (может быть числом или строкой)
  title: string;           // Текст задачи
  completed: boolean;     // Статус выполнения
}

interface ExistingTask {
  id: string | number;    // ID существующей задачи (может быть числом или строкой)
  text: string;           // Текст задачи
  completed: boolean;     // Статус выполнения
}

export const useTaskDataManager = (): {
  processTaskData: (apiData: ApiTask[], existingTasks: ExistingTask[]) => ExistingTask[]
} => {
  const processTaskData = (apiData: ApiTask[], existingTasks: ExistingTask[]): ExistingTask[] => {
    // ✅ ВАЛИДАЦИЯ: Проверяем что apiData существует и является массивом
    if (!apiData || !Array.isArray(apiData)) return [];
    
    // ✅ ТРАНСФОРМАЦИЯ: Преобразуем данные из API в наш внутренний формат
    const transformedTasks = apiData.map(item => ({
      id: `api-${item.id}`,        // Добавляем префикс к ID для уникальности
      text: item.title,             // Копируем текст задачи
      completed: item.completed    // Копируем статус выполнения
    }));
    
    // ✅ ФИЛЬТРАЦИЯ: Удаляем дубликаты по тексту задачи
    const filteredTasks = transformedTasks.filter(newTask =>
      !existingTasks.some(existing => existing.text === newTask.text)
    );
    
    return filteredTasks;
  };

  // ✅ ИНТЕРФЕЙС: Возвращаем функцию для обработки данных
  return { processTaskData };
};