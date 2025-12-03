/**
 * КОМПОНЕНТ: AddTask (Форма добавления)
 * Ответственность: управление формой добавления задач
 * Паттерн: Presentational Component (отвечает только за отображение)
 */
import { useAddTaskForm } from "../hooks/useAddTaskForm.tsx"
import React from "react"
import './styles/AddTask.css' // 👈 Импортируем новые стили

interface AddTaskProps {
    onAddTask: (text: string) => void
}

const AddTask = React.memo(({ onAddTask }: AddTaskProps) => {

    const {handleSubmit, inputValue, setInputValue, isLoading, error} = useAddTaskForm(onAddTask)
    const charCount = inputValue.length
    const maxChars = 100

    const getCounterClass = () => {
        if (charCount > maxChars) return 'add-task-counter-error'
        if (charCount > maxChars * 0.8) return 'add-task-counter-warning'
        return 'add-task-counter-normal'
    }

    return (
        <form className="add-task-form" onSubmit={handleSubmit}>
            <h3 className="add-task-title">Add New Task</h3>
            
            <div className="add-task-group">
                <input
                    type="text"
                    className="add-task-input"
                    value={inputValue}
                    onChange={(e) => {
                        if (e.target.value.length <= maxChars) {
                            setInputValue(e.target.value)
                        }
                    }}
                    disabled={isLoading}
                    placeholder="What needs to be done?"
                    maxLength={maxChars}
                    autoFocus
                />
                
                <div className="add-task-counter">
                    <span>Maximum {maxChars} characters</span>
                    <span className={getCounterClass()}>
                        {charCount}/{maxChars}
                    </span>
                </div>
            </div>
            
            <button 
                type="submit" 
                className="add-task-button"
                disabled={isLoading || !inputValue.trim() || charCount > maxChars}
            >
                {isLoading ? (
                    <>
                        <span className="add-task-loading"></span>
                        Adding Task...
                    </>
                ) : (
                    'Add Task'
                )}
            </button>
            
            {error && (
                <div className="add-task-error">
                    ⚠️ {error}
                </div>
            )}
        </form>
    )
})

export default AddTask