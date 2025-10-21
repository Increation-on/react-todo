// Импорты из React
import { useState } from "react"
import React from "react"

// 🔹 Интерфейс описывает ЧТО возвращает хук
// <T> означает "типовой параметр" - хук будет работать с ЛЮБЫМ типом данных
interface ApiReturn<T> {
    isLoading: boolean                    // Флаг загрузки: true/false
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,  // Функция для изменения isLoading
    error: string | null                 // Текст ошибки или null если нет ошибки
    setError: React.Dispatch<React.SetStateAction<string | null>> // Функция для изменения error
    fetchWithState: (url: string) => Promise<T>,  // Функция для запросов, возвращает Promise с типом T
}

// 🔹 Создаём кастомный хук useApi
// <T,> запятая нужна для TSX файлов чтобы отличить от JSX тегов
// : ApiReturn<T> указывает что возвращаем объект типа ApiReturn
export const useApi = <T,>(): ApiReturn<T> => { // запятая после T - убираем конфликт jsx и tsx
    // 🔹 Состояние для отслеживания загрузки
    // useState<boolean> - явно указываем тип состояния
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // 🔹 Состояние для ошибок
    // string | null - ошибка может быть текстом или отсутствовать (null)
    const [error, setError] = useState<string | null>(null)

    // 🔹 Основная функция для выполнения запросов
    // url: string - параметр должен быть строкой
    // : Promise<T> - функция возвращает Promise с данными типа T
    const fetchWithState = async (url: string): Promise<T> => {
        // Перед запросом: включаем загрузку, сбрасываем ошибки
        setIsLoading(true)
        setError(null)
        console.log('Start loading')

        try {
            // Выполняем HTTP запрос
            const response = await fetch(url)

            // Проверяем статус ответа (200-299 = успех)
            if (!response.ok) throw new Error('Ошибка загрузки')

            // Парсим JSON из ответа
            const result = await response.json()
            console.log('Данные получены:', result)

            // Возвращаем результат - TypeScript считает что это тип T
            return result

        } catch (error) {
            // Обрабатываем ошибку
            // В TypeScript error имеет тип unknown, поэтому нужно преобразовать
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            setError(errorMessage)
            console.log('Ошибка:', error)
            
            // Пробрасываем ошибку дальше для обработки в вызывающем коде
            throw error
        } finally {
            // Выключаем загрузку в ЛЮБОМ случае (успех или ошибка)
            setIsLoading(false)
        }
    }

    // 🔹 Возвращаем объект с состоянием и методами для работы с API
    return { isLoading, setIsLoading, error, setError, fetchWithState }
}

//  Ключевые моменты:
// <T,> — дженерик параметр для работы с любыми типами данных

// Promise<T> — функция возвращает Promise с нашим типом T

// string | null — тип "или строка, или null"

// React.Dispatch<...> — тип функций setState

// error instanceof Error — проверка типа ошибки в catch