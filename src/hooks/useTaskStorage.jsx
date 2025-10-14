import { useEffect } from "react"

export const useTaskStorage = (tasks, setTasks) => {
    // 🎯 Эффект для ЗАГРУЗКИ задач из localStorage
    // Выполняется при монтировании компонента (т.к. [setTasks] стабильна)
    useEffect(() => {
        const saved = localStorage.getItem('tasks') // ⬅️ Получаем данные из хранилища
        if (saved && saved !== '[]') { // ⬅️ Проверяем что данные есть и не пустой массив
            const parsed = JSON.parse(saved) // ⬅️ Преобразуем JSON строку в массив объектов
            setTasks(parsed) // ⬅️ Устанавливаем задачи в состояние
        }
    }, [setTasks]) // ⬅️ Зависимость: setTasks (стабильная функция)

    // 🎯 Эффект для СОХРАНЕНИЯ задач в localStorage  
    // Выполняется при каждом изменении tasks
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks)) // ⬅️ Сохраняем как JSON строку
    }, [tasks]) // ⬅️ Зависимость: tasks (массив задач)
}

// ⚠️ OPTIMIZATION: При первом рендере происходит двойная установка
// - Загрузка из localStorage → setTasks()
// - Изменение tasks → сохранение в localStorage
// В будущем можно оптимизировать через useRef/isFirstRender