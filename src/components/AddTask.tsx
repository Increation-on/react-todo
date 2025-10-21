/**
 * КОМПОНЕНТ: AddTask (Форма добавления)
 * Ответственность: управление формой добавления задач
 * Паттерн: Presentational Component (отвечает только за отображение)
 */
import { useAddTaskForm } from "../hooks/useAddTaskForm.tsx"
import React from "react"

interface AddTaskProps {
    onAddTask: (text: string) => void
}

const AddTask = React.memo(({ onAddTask }: AddTaskProps) => { // ✅ PROPS: Колбэк для добавления задачи в родительский компонент

    // ✅ HOOK: Вся логика формы вынесена в отдельный хук
    const {handleSubmit, inputValue, setInputValue, isLoading, error} = useAddTaskForm(onAddTask)

    return (
        <form className="add-task-form" onSubmit={handleSubmit}> {/* ✅ FORM: Стандартная HTML форма */}
            <input
                type="text"
                value={inputValue} // ✅ BINDING: Контролируемый инпут (значение из состояния)
                onChange={(e) => setInputValue(e.target.value)} // ✅ EVENT: Обновление состояния при вводе
                disabled={isLoading} // ✅ UX: Блокировка во время загрузки
                placeholder="Введите новую задачу..."
            />
            <button type="submit" disabled={isLoading}> {/* ✅ UX: Блокировка кнопки во время загрузки */}
                {isLoading ? 'Adding a task...' : 'Add task'} {/* ✅ STATE: Динамический текст кнопки */}
            </button>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>Error: {error}</div>} 
            {/* ✅ ERROR: Условный рендеринг ошибки */}
        </form>
    )
})

export default AddTask