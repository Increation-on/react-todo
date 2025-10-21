import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useTaskStore = create(persist(
    (set, get) => ({
        tasks: [],

        addTask: (text) => set(state => ({
            tasks: [...state.tasks, {
                id: crypto.randomUUID(),
                text: text.text || text,
                completed: false
            }]
        })),

        toggleTask: (id) => set(state => ({
            tasks: state.tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        })),

        deleteTask: (id) => set(state => ({
            tasks: state.tasks.filter(task => task.id !== id)
        }))
    }),


    {
        name: 'tasks-storage'
    }
))