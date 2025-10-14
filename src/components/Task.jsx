/**
 * КОМПОНЕНТ: Task (Элемент задачи)
 * Ответственность: отображение одной задачи, делегирование событий
 * Паттерн: Presentational Component / Dumb Component
 */

const Task = ({ task, onToggle, onDelete }) => {
    // ✅ PROPS: Деструктуризация пропсов для удобства доступа
    // task - данные задачи, onToggle/onDelete - callback функции

    return (
        <li className="task">
            {/* ✅ UI: Текст задачи с условным стилем выполнения */}
            <span className={task.completed ? 'completed' : ''}>
                {task.text}
            </span>

            {/* ✅ UI: Чекбокс для переключения статуса выполнения */}
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task)}  // 🎯 EVENT: Передаем задачу в колбэк
            />

            {/* ✅ UI: Кнопка удаления задачи */}
            <button onClick={
                () => onDelete(task)} // 🎯 EVENT: Передаем задачу в колбэк
            >
                Delete
            </button>
        </li>
    )
}

export default Task