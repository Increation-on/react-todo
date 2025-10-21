import { useReducer } from "react"

export const useTaskReducer = () => {
    
    // 🎯 НАЧАЛЬНОЕ СОСТОЯНИЕ: объект с tasks и filter
    const initialState = {
        tasks: [],        // массив задач (пока пустой)
        filter: 'all'     // фильтр: 'all', 'active', 'completed'
    }
    

    // 🎯 REDUCER-ФУНКЦИЯ: чистая функция для обновления состояния
    // Принимает: state (текущее состояние), action (что сделать)
    // Возвращает: NEW STATE (новое состояние)
    const taskReducer = (state, action) => {
       
        // 🎯 SWITCH: определяем КАК обновить состояние based on action.type
        switch (action.type) {

            // 🎯 CASE: ДОБАВИТЬ ЗАДАЧУ
            case 'ADD_TASK':
                // 🎯 СОЗДАЁМ НОВУЮ ЗАДАЧУ из action.payload
                const newTask = {
                    id: action.payload.id || Date.now(), // ID из payload или текущее время
                    text: action.payload.text || action.payload, // текст из payload
                    completed: action.payload.completed || false // статус из payload или false
                }
                // 🎯 ВОЗВРАЩАЕМ НОВЫЙ STATE:
                return {
                    ...state,          // копируем все поля (filter)
                    tasks: [...state.tasks, newTask] // заменяем tasks на старые + новая
                }

            // 🎯 CASE: ПЕРЕКЛЮЧИТЬ СТАТУС ЗАДАЧИ
            case 'TOGGLE_TASK':
                return {
                    ...state,
                    // 🎯 MAP: проходим по всем задачам
                    tasks: state.tasks.map(task => {
                        // 🎯 ЕСЛИ: это та задача которую нужно изменить
                        if (task.id === action.payload) { // action.payload = ID задачи
                            // 🎯 ВОЗВРАЩАЕМ: копию задачи с изменённым completed
                            return { ...task, completed: !task.completed }
                        }
                        // 🎯 ИНАЧЕ: возвращаем задачу без изменений
                        return task
                    })
                }

            // 🎯 CASE: УДАЛИТЬ ЗАДАЧУ
            case 'DELETE_TASK':
                return {
                    ...state,
                    // 🎯 FILTER: оставляем только задачи с ID НЕ равным action.payload
                    tasks: state.tasks.filter(task => {
                        return task.id !== action.payload // true = оставить, false = удалить
                    })
                }

            // 🎯 CASE: ЗАГРУЗИТЬ ЗАДАЧИ (из localStorage)
            case 'LOAD_TASKS':
                 
                return {
                    ...state,
                    tasks: action.payload // заменяем ВЕСЬ массив задач
                }

            // 🎯 DEFAULT: если action.type неизвестен - возвращаем state без изменений
            default:
                return state
        }
    }

    // 🎯 USE-REDUCER: хук React для управления состоянием
    // Возвращает: state (текущее состояние) и dispatch (функция для отправки actions)
    const [state, dispatch] = useReducer(taskReducer, initialState)
    

    // 🎯 ВОЗВРАЩАЕМ ИНТЕРФЕЙС: state и dispatch для использования в компонентах
    return { state, dispatch }
}