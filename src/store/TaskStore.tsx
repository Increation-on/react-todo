import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface Task {
  id: number | string;
  text: string;
  completed: boolean;
}

interface TaskStore {
  tasks: Task[];
  addTask: (text: string ) => void;
  toggleTask: (id: number | string) => void;
  deleteTask: (id: number | string) => void;
  getTotalTasks: () => number;
}

// 🎯 СОЗДАЁМ ГЛОБАЛЬНЫЙ STORE ДЛЯ УПРАВЛЕНИЯ ЗАДАЧАМИ
export const useTaskStore = create<TaskStore>()(persist(
    // 🎯 ФУНКЦИЯ STORE: принимает set (изменение состояния) и get (чтение состояния)
    (set, get) => ({
        // ✅ СОСТОЯНИЕ: массив задач (начальное значение - пустой массив)
        tasks: [],

        // ✅ ДЕЙСТВИЕ: добавление новой задачи
        addTask: (text) => set(state => ({
            tasks: [...state.tasks, {
                id: Date.now() + Math.random(),  // 🆔 Генерируем уникальный ID (crypto может не работать)
                text: text,         // 📝 Текст задачи (поддержка разных форматов)
                completed: false                 // ⚪ Статус "не выполнено" по умолчанию
            }]
        })),

        // ✅ ДЕЙСТВИЕ: переключение статуса выполнения задачи
        toggleTask: (id) => set(state => ({
            tasks: state.tasks.map(task =>
                task.id === id 
                    ? { ...task, completed: !task.completed }  // 🔄 Инвертируем статус
                    : task                                      // ⏩ Остальные задачи без изменений
            )
        })),

        // ✅ ДЕЙСТВИЕ: удаление задачи по ID
        deleteTask: (id) => set(state => ({
            tasks: state.tasks.filter(task => task.id !== id)  // 🗑️ Фильтруем массив, оставляя все кроме удаляемой
        })),
        
        // ✅ ГЕТТЕР: получение общего количества задач (НЕ изменяет состояние!)
        getTotalTasks: () => get().tasks.length,  // 📊 get() даёт доступ к текущему состоянию
    }),

    // 🎯 PERSIST CONFIG: настройки авто-сохранения в localStorage
    {
        name: 'tasks-storage'  // 💾 Ключ для хранения в localStorage
    }
)) 
