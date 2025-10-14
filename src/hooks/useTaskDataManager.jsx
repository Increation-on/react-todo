export const useTaskDataManager = () => {
  const processTaskData = (apiData, existingTasks) => {
    // ✅ VALIDATION: Проверка входных данных
    if (!apiData || !Array.isArray(apiData)) return []
    
    // ✅ TRANSFORMATION: Преобразование данных API в наш формат
    const transformedTasks = apiData.map(item => ({
      id: `api-${item.id}`,        // ✅ ID: Создаем уникальный ID с префиксом
      text: item.title,            // ✅ TEXT: Преобразуем title → text
      completed: item.completed    // ✅ STATUS: Копируем статус выполнения
    }))
    
    // ✅ FILTERING: Удаляем дубликаты (по тексту задачи)
    const filteredTasks = transformedTasks.filter(newTask =>
      !existingTasks.some(existing => existing.text === newTask.text)
    )
    
    return filteredTasks
  }

  // ✅ INTERFACE: Возвращаем функцию для обработки данных
  return { processTaskData }
}


// Почему хук, а не простая функция?

// Возможность расширения (добавление useState/useEffect)

// Единый интерфейс для всех операций с данными