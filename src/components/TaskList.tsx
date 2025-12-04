// TaskList.tsx
import { useState, useCallback, useEffect } from "react"
import Task from "./Task.tsx"
import AddTask from "./AddTask.tsx"
import Search from "./Search.tsx"
import { useTasksAPI } from '../hooks/useTasksAPI.tsx'
import { useTaskStore } from "../store/TaskStore.tsx"
import { useAuthStore } from "../store/AuthStore.tsx"
import { useSearch } from '../hooks/useSearch.tsx'
import './styles/TaskList.css'

type TaskType = {
    id: string | number;
    text: string;
    completed: boolean;
    userId: string;
    createdAt: string;
}

const TaskList: React.FC = () => {
    const userId = useAuthStore(state => state.getUserId())
    const getUserTasks = useTaskStore(state => state.getUserTasks)
    const tasks = getUserTasks(userId) as TaskType[]
    
    const addTask = useTaskStore(state => state.addTask)
    const toggleTask = useTaskStore(state => state.toggleTask)
    const deleteTask = useTaskStore(state => state.deleteTask)

    // Используем хук useSearch
    const {
        query,
        setQuery,
        results: searchResults,
        isLoading: isSearching,
        clearSearch
    } = useSearch({
        items: tasks,
        searchFn: (task, query) => 
            task.text.toLowerCase().includes(query.toLowerCase()),
        debounceMs: 300
    })

    // 🔥 Теперь храним только ID выбранной задачи
    const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(null)
    const [showAutocomplete, setShowAutocomplete] = useState(true)

    // 🔥 Находим актуальную задачу по ID
    const selectedTask = selectedTaskId 
        ? tasks.find(t => t.id === selectedTaskId) 
        : null

    // 🔥 Показываем либо выбранную, либо все задачи
    const tasksToShow = selectedTask ? [selectedTask] : tasks

    // Обработчик изменения инпута
    const handleInputChange = useCallback((value: string): void => {
        setQuery(value)
        if (value.trim()) {
            setShowAutocomplete(true)
        }
    }, [setQuery])

    // Обработчик выбора задачи из поиска
    const handleTaskSelect = useCallback((selectedTask: TaskType): void => {
        setQuery(selectedTask.text)
        setSelectedTaskId(selectedTask.id) // 🔥 Сохраняем только ID
        setShowAutocomplete(false)
    }, [setQuery])

    // Обработчик очистки поиска
    const handleClearSearch = useCallback((): void => {
        clearSearch()
        setSelectedTaskId(null) // 🔥 Сбрасываем ID
        setShowAutocomplete(false)
    }, [clearSearch])

    // Обработчик нажатия клавиш
    const handleKeyDown = useCallback((e: React.KeyboardEvent): void => {
        if (e.key === 'Enter') {
            setShowAutocomplete(false)
            if (searchResults.length > 0) {
                handleTaskSelect(searchResults[0])
            }
        }
        if (e.key === 'Escape') {
            setShowAutocomplete(false)
        }
    }, [searchResults, handleTaskSelect])

    const handleFocus = useCallback((): void => {
        if (searchResults.length > 0 && query.trim()) {
            setShowAutocomplete(true)
        }
    }, [searchResults, query])

    // Обработчик клика вне компонента для скрытия автокомплита
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (!target.closest('.search-section')) {
                setShowAutocomplete(false)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    const { loadTasksFromAPI, isLoading } = useTasksAPI(tasks)

    const handleLoadFromAPI = async (): Promise<void> => {
        try {
            const tasksToAdd = await loadTasksFromAPI()
            tasksToAdd.forEach(task => {
                addTask(task.text)
            })
            setSelectedTaskId(null) // 🔥 Сбрасываем при загрузке новых задач
            setShowAutocomplete(false)
        } catch (error) {
            console.error('Failed to load tasks:', error)
        }
    }

    const handleToggle = useCallback((id: string | number): void => {
        toggleTask(id)
        setSelectedTaskId(null) // 🔥 Сбрасываем при изменении задачи
    }, [toggleTask])

    const handleDelete = useCallback((id: string | number): void => {
        if (window.confirm('Вы уверены что хотите удалить задачу?')) {
            deleteTask(id)
            setSelectedTaskId(null) // 🔥 Сбрасываем при удалении
            
            // Если удалили выбранную задачу - очищаем поиск
            if (id === selectedTaskId) {
                clearSearch()
            }
        }
    }, [deleteTask, selectedTaskId, clearSearch])

    const handleAddTaskWithReset = useCallback((text: string): void => {
        addTask(text)
        setSelectedTaskId(null) // 🔥 Сбрасываем при добавлении новой
        setShowAutocomplete(false)
    }, [addTask])

    return (
        <div className="task-list-container">
            <h2 className="task-list-title">Tasks List</h2>
            
            <button 
                onClick={handleLoadFromAPI} 
                disabled={isLoading}
                className="list-control-button"
                style={{ marginBottom: '1rem' }}
                aria-label="Load example tasks from API"
            >
                {isLoading ? 'Loading...' : 'Load Tasks from API'}
            </button>
            
            

            <AddTask onAddTask={handleAddTaskWithReset} />

            <Search 
                value={query}
                onChange={handleInputChange}
                results={searchResults}
                onSelect={handleTaskSelect}
                onClear={handleClearSearch}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                showAutocomplete={showAutocomplete}
                isLoading={isSearching}
                placeholder="🔍 Search tasks..."
            />

            {tasksToShow.length === 0 ? (
                <div className="empty-list">
                    <div className="empty-list-icon">📋</div>
                    <p>No tasks found. Try a different search or add a new task!</p>
                </div>
            ) : (
                <ul className="task-list" role="list">
                    {tasksToShow.map(task => (
                        <Task
                            key={task.id}
                            task={task}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

export default TaskList