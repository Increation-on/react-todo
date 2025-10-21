import React, { useState } from "react"

interface AddTaskFormReturn {
    inputValue: string,
    isLoading: boolean,
    error: string,
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
    setInputValue: React.Dispatch<React.SetStateAction<string>>
}

export const useAddTaskForm = (onAddTask: (taskText: string) => void): AddTaskFormReturn => {
    // ✅ STATE: Управление состоянием формы
    const [inputValue, setInputValue] = useState<string>('') // Текст в поле ввода
    const [isLoading, setIsLoading] = useState<boolean>(false) // Флаг загрузки (true/false)
    const [error, setError] = useState<string>('') // Текст ошибки (пустая строка = нет ошибки)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        // ✅ EVENT: Предотвращаем стандартное поведение формы
        e.preventDefault()

        // ✅ STATE: Сбрасываем ошибки и включаем загрузку
        setError('')
        setIsLoading(true)

        try {
            // ✅ VALIDATION: Проверяем что поле не пустое
            if (inputValue.trim()) {
                // ✅ UX: Имитация задержки сети для лучшего восприятия
                await new Promise(resolve => setTimeout(resolve, 300))

                // ✅ BUSINESS: Вызываем колбэк родителя для добавления задачи
                onAddTask(inputValue)

                // ✅ UX: Очищаем поле после успешного добавления
                setInputValue('')
            }
        } catch (error) {
            // ✅ ERROR: Обработка ошибок при добавлении задачи
            setError('Failed to add task =(')
        } finally {
            // ✅ STATE: Выключаем загрузку в любом случае
            setIsLoading(false)
        }
    }

    // ✅ INTERFACE: Возвращаем интерфейс для работы с формой
    return { inputValue, isLoading, error, handleSubmit, setInputValue }
}