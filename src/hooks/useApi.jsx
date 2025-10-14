import { useState } from "react"

export const useApi = () => {
    // ✅ STATE: Управление состоянием API запросов
    const [isLoading, setIsLoading] = useState(false) // Флаг выполнения запроса
    const [error, setError] = useState(null) // Ошибка запроса или null

    const fetchWithState = async (url) => {
        // ✅ STATE: Начало загрузки - сброс ошибок
        setIsLoading(true)
        setError(null)
        console.log('Start loading')

        try {
            // ✅ NETWORK: Выполнение HTTP запроса
            const response = await fetch(url);
            
            // ✅ VALIDATION: Проверка статуса ответа
            if (!response.ok) throw new Error('Ошибка загрузки');
            
            // ✅ DATA: Парсинг JSON ответа
            const result = await response.json();
            console.log('Данные получены:', result);
            
            // ✅ RETURN: Возвращаем данные для дальнейшей обработки
            return result
            
        } catch (error) {
            // ✅ ERROR: Обработка сетевых и других ошибок
            setError(error.message);
            console.log('Ошибка:', error);
            throw error // Пробрасываем ошибку для обработки в вызывающем коде
        } finally {
            // ✅ STATE: Завершение загрузки в любом случае
            setIsLoading(false)
        }
    }

    // ✅ INTERFACE: Возвращаем состояние и метод для запросов
    return { isLoading, setIsLoading, error, setError, fetchWithState }
}