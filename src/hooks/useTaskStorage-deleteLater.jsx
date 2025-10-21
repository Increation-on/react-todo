import { useEffect } from "react"
import { useRef } from "react"

export const useTaskStorage = (tasks, dispatch) => {
    // 🎯 СОЗДАЁМ ФЛАГ ПЕРВОГО РЕНДЕРА
    // useRef создаёт мутабельное значение, которое сохраняется между рендерами
    // isFirstRender.current = true только при первом рендере
    const isFirstRender = useRef(true)
    
    // 🎯 Эффект для ЗАГРУЗКИ задач из localStorage
    // useEffect выполняется после рендера компонента
    useEffect(() => {
        // 🎯 ПРОВЕРЯЕМ: это первый рендер?
        if (isFirstRender.current) {
            // 🎯 ПОЛУЧАЕМ данные из localStorage
            // localStorage.getItem возвращает строку или null
            const saved = localStorage.getItem('tasks')
            
            // 🎯 ПРОВЕРЯЕМ: есть ли сохранённые данные и они не пустой массив?
            if (saved && saved !== '[]') {
                // 🎯 ПРЕОБРАЗУЕМ JSON строку обратно в массив объектов
                // JSON.parse превращает "[]" в [] или "[{...}]" в [{...}]
                const parsed = JSON.parse(saved)
                
                // 🎯 ОТПРАВЛЯЕМ ACTION в редьюсер
                // dispatch говорит редьюсеру обновить состояние
                dispatch({ type: 'LOAD_TASKS', payload: parsed })
            }
            
            // 🎯 ПЕРЕКЛЮЧАЕМ ФЛАГ: первый рендер завершён
            // Теперь isFirstRender.current = false на всех последующих рендерах
            isFirstRender.current = false
        }
    }, [dispatch]) // 🎯 ЗАВИСИМОСТЬ: эффект сработает если dispatch изменится

    // 🎯 Эффект для СОХРАНЕНИЯ задач в localStorage  
    useEffect(() => {
        // 🎯 СОХРАНЯЕМ задачи в localStorage
        // JSON.stringify превращает массив объектов в строку
        // Например: [{id: 1, text: "Задача"}] → "[{"id":1,"text":"Задача"}]"
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }, [tasks]) // 🎯 ЗАВИСИМОСТЬ: эффект сработает при КАЖДОМ изменении tasks
}

// 🎯 ПРОСТЫМИ СЛОВАМИ:
// Этот хук делает две вещи:

//1. При первом открытии приложения - загружает сохранённые задачи
//2. При каждом изменении задач - сохраняет их автоматически

// Как будто у тебя есть личный помощник, который:
// 📥 Запоминает где ты остановился (загрузка)
// 📤 Записывает что ты сделал (сохранение)