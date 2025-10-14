export const useTaskManager = (setTasks) => {
    // ✅ OPERATION: Создание и добавление новой задачи
    const onAddTask = (taskData) => {
        const newTask = {
            id: taskData.id || Date.now(), // ✅ ID: Генерация или использование существующего
            text: taskData.text || taskData, // ✅ TEXT: Поддержка разных форматов ввода
            completed: taskData.completed || false // ✅ STATUS: Статус по умолчанию
        }
        setTasks(prevTasks => [...prevTasks, newTask]) // ✅ UPDATE: Добавление в состояние
    }

    // ✅ OPERATION: Переключение статуса выполнения задачи
    const onToggle = (task) => {
        setTasks(prevTasks =>
            prevTasks.map(currentTask => {
                if (currentTask.id === task.id) { // ✅ FIND: Поиск задачи по ID
                    return { // ✅ IMMUTABILITY: Создание нового объекта
                        ...currentTask, // ✅ SPREAD: Копирование свойств
                        completed: !currentTask.completed // ✅ TOGGLE: Инверсия статуса
                    }
                }
                return currentTask // ✅ RETURN: Остальные задачи без изменений
            })
        )
    }

    // ✅ OPERATION: Удаление задачи из списка
    const onDelete = (task) => {
        setTasks(prevTasks => {
            return prevTasks.filter(currentTask => {
                return currentTask.id !== task.id // ✅ FILTER: Исключение задачи по ID
            })
        })
    }

    // ✅ INTERFACE: Публичный API для управления задачами
    return { onAddTask, onToggle, onDelete }
}