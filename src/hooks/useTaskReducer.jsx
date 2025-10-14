import { useReducer } from "react"

export const useTaskReducer = () => {


    const fakeData = [{
        id: 1,
        text: "Изучить React Hooks",
        completed: false
    },
    {
        id: 2,
        text: "Разобраться с useReducer",
        completed: true
    },
    {
        id: 3,
        text: "Сделать ToDo приложение",
        completed: false
    }]

    const initialState = {
        tasks: [],        // массив задач
        filter: 'all'     // фильтр: 'all', 'active', 'completed'
    }

    const taskReducer = (state, action) => {
        switch (action.type) {

            case 'ADD_TASK':
                const newTask = {
                    id: action.payload.id || Date.now(),
                    text: action.payload.text || action.payload,
                    completed: action.payload.completed || false
                }
                return {
                    ...state,
                    tasks: [...state.tasks, newTask]
                }

            case 'TOGGLE_TASK':
                return {
                    ...state,
                    tasks: state.tasks.map(task => {
                        if (task.id === action.payload) {
                            return { ...task, completed: !task.completed }
                        }
                        return task
                    })
                }
            case 'DELETE_TASK':
                return {
                    ...state,
                    tasks: state.tasks.filter(task => {
                        return task.id !== action.payload
                    })
                }

            case 'LOAD_TASKS':
                return {
                    ...state,
                    tasks: action.payload
                }

            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(taskReducer, initialState)

    // // Просто посмотрим на начальное состояние
    // console.log(state) // Должны увидеть 3 задачи

    // // Протестируем действия:
    // dispatch({ type: 'TOGGLE_TASK', payload: 1 }) // Переключим первую задачу
    // dispatch({ type: 'DELETE_TASK', payload: 2 }) // Удалим вторую задачу  
    // dispatch({
    //     type: 'ADD_TASK',
    //     payload: { text: 'Новая задача' }
    // }) // Добавим новую

    return { state, dispatch }
}
