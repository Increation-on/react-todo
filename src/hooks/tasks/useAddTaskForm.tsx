import React, { useState } from "react"
import { useTaskNotifications } from "./../ui/useTaskNotification.tsx"

export const useAddTaskForm = (onAddTask: (taskText: string) => void) => {
    const [inputValue, setInputValue] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const taskNotify = useTaskNotifications()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const trimmedValue = inputValue.trim()
            
            if (!trimmedValue) {
                setError('Task text cannot be empty')
                taskNotify.error('Task text cannot be empty')
                return
            }
            
            await new Promise(resolve => setTimeout(resolve, 300))
            onAddTask(trimmedValue)
            taskNotify.created(trimmedValue)
            setInputValue('')
            
        } catch (error) {
            setError('Failed to add task =(')
            taskNotify.error('Failed to add task')
        } finally {
            setIsLoading(false)
        }
    }

    return { inputValue, isLoading, error, handleSubmit, setInputValue }
}