// /src/store/taskStore.ts - ПОЛНАЯ ВЕРСИЯ С DnD
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuthStore } from './AuthStore.tsx'

type Priority = 'high' | 'medium' | 'low' | 'none'

interface Task {
    id: number | string;
    text: string;
    completed: boolean;
    userId: string;
    createdAt: string;
    priority: Priority;
    orderIndex: number;
}

interface TaskStore {
    tasks: Task[];

    // 🔥 НОВЫЕ МЕТОДЫ ДЛЯ DnD
    reorderTasksInColumn: (
        priority: Priority,
        newOrder: (string | number)[]
    ) => void;

    updateTaskPriority: (
        taskId: string | number,
        newPriority: Priority,
        newOrderIndex?: number
    ) => void;

    // Существующие методы
    getUserTasks: (userId: string | null) => Task[];
    addTask: (text: string) => void;
    toggleTask: (id: number | string) => void;
    deleteTask: (id: number | string) => void;
    getTotalTasks: () => number;
    getActiveTasks: () => Task[];
    getCompletedTasks: () => Task[];
    updateTaskText: (id: number | string, newText: string) => void;
}

export const useTaskStore = create<TaskStore>()(
    persist(
        (set, get) => ({
            tasks: [],

            // 🔥 DnD МЕТОД 1: Пересортировка внутри колонки
            reorderTasksInColumn: (priority, newOrder) => {
                const userId = useAuthStore.getState().getUserId();
                if (!userId) {
                    console.error('Пользователь не авторизован');
                    return;
                }

                set(state => {
                    // 1. Разделяем задачи: пользовательские в этой колонке и все остальные
                    const userTasksInColumn = state.tasks.filter(
                        task => task.userId === userId && task.priority === priority
                    );

                    const otherTasks = state.tasks.filter(
                        task => !(task.userId === userId && task.priority === priority)
                    );

                    // 2. Создаем мапу для быстрого поиска
                    const taskMap = new Map();
                    userTasksInColumn.forEach(task => {
                        taskMap.set(task.id.toString(), task);
                    });

                    // 3. Создаем новые задачи с обновленными orderIndex
                    const reorderedTasks = newOrder
                        .map((taskId, index) => {
                            const task = taskMap.get(taskId.toString());
                            if (!task) {
                                console.warn(`Задача ${taskId} не найдена в колонке ${priority}`);
                                return null;
                            }
                            return {
                                ...task,
                                orderIndex: index
                            };
                        })
                        .filter(Boolean) as Task[];

                    // 4. Возвращаем объединенный массив
                    return {
                        tasks: [...otherTasks, ...reorderedTasks]
                    };
                });

            },

            // 🔥 DnD МЕТОД 2: Изменение приоритета задачи
            updateTaskPriority: (taskId, newPriority, newOrderIndex = 0) => {
                const userId = useAuthStore.getState().getUserId();
                if (!userId) {
                    console.error('Пользователь не авторизован');
                    return;
                }

                set(state => {
                    // 1. Находим задачу
                    const taskIndex = state.tasks.findIndex(
                        t => t.id === taskId && t.userId === userId
                    );

                    if (taskIndex === -1) {
                        console.error(`Задача ${taskId} не найдена или нет доступа`);
                        return state;
                    }

                    const task = state.tasks[taskIndex];

                    // 2. Если приоритет не меняется, просто обновляем orderIndex
                    if (task.priority === newPriority) {
                        const updatedTasks = [...state.tasks];
                        updatedTasks[taskIndex] = {
                            ...task,
                            orderIndex: newOrderIndex
                        };
                        return { tasks: updatedTasks };
                    }

                    // 3. Меняем приоритет и orderIndex
                    const updatedTask = {
                        ...task,
                        priority: newPriority,
                        orderIndex: newOrderIndex
                    };

                    const updatedTasks = [...state.tasks];
                    updatedTasks[taskIndex] = updatedTask;

                    return { tasks: updatedTasks };
                });
            },

            // 🔥 ПОЛУЧЕНИЕ ЗАДАЧ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
            getUserTasks: (userId: string | null) => {
                if (!userId) return [];
                return get().tasks
                    .filter(task => task.userId === userId)
                    .sort((a, b) => a.orderIndex - b.orderIndex); // Сортируем по orderIndex
            },

            // 🔥 ДОБАВЛЕНИЕ ЗАДАЧИ
            addTask: (text) => {
                const userId = useAuthStore.getState().getUserId();
                if (!userId) {
                    console.error('Нельзя добавить задачу: пользователь не авторизован');
                    return;
                }

                // 🔥 ИСПРАВЛЕНИЕ: Всю логику внутри set
                set(state => {
                    // Находим задачи пользователя в колонке 'none' ИЗ ТЕКУЩЕГО СОСТОЯНИЯ
                    const userNoneTasks = state.tasks.filter(
                        task => task.userId === userId && task.priority === 'none'
                    );

                    const nextOrderIndex = userNoneTasks.length;

                    const newTask: Task = {
                        id: Date.now() + Math.random(),
                        text: text.trim(),
                        completed: false,
                        userId: userId,
                        createdAt: new Date().toISOString(),
                        priority: 'none',
                        orderIndex: nextOrderIndex
                    };

                    return {
                        tasks: [...state.tasks, newTask]
                    };
                });
            },

            // 🔥 ПЕРЕКЛЮЧЕНИЕ СТАТУСА
            toggleTask: (id) => {
                const userId = useAuthStore.getState().getUserId();
                set(state => ({
                    tasks: state.tasks.map(task =>
                        task.id === id && task.userId === userId
                            ? { ...task, completed: !task.completed }
                            : task
                    )
                }));
            },

            // 🔥 УДАЛЕНИЕ
            deleteTask: (id) => {
                const userId = useAuthStore.getState().getUserId();
                set(state => ({
                    tasks: state.tasks.filter(task =>
                        !(task.id === id && task.userId === userId)
                    )
                }));
            },

            // 🔥 ГЕТТЕРЫ
            getTotalTasks: () => {
                const userId = useAuthStore.getState().getUserId();
                if (!userId) return 0;
                return get().tasks.filter(task => task.userId === userId).length;
            },

            getActiveTasks: () => {
                const userId = useAuthStore.getState().getUserId();
                if (!userId) return [];
                return get().tasks
                    .filter(task => task.userId === userId && !task.completed)
                    .sort((a, b) => a.orderIndex - b.orderIndex);
            },

            getCompletedTasks: () => {
                const userId = useAuthStore.getState().getUserId();
                if (!userId) return [];
                return get().tasks
                    .filter(task => task.userId === userId && task.completed)
                    .sort((a, b) => a.orderIndex - b.orderIndex);
            },

            updateTaskText: (id, newText) => {
                const userId = useAuthStore.getState().getUserId();
                const trimmedText = newText.trim();

                if (!trimmedText) {
                    console.warn('Попытка обновить задачу пустым текстом');
                    return;
                }

                if (!userId) {
                    console.error('Нельзя обновить задачу: пользователь не авторизован');
                    return;
                }

                set(state => ({
                    tasks: state.tasks.map(task =>
                        task.id === id && task.userId === userId
                            ? { ...task, text: trimmedText }
                            : task
                    )
                }));
            },
        }),

        // 🎯 PERSIST CONFIG
        {
            name: 'tasks-storage',
            version: 2, // Увеличиваем версию для миграции

            migrate: (persistedState: any, version: number) => {
                // Для версии 0 или 1 делаем полную миграцию
                if (version < 2) {

                    if (!persistedState || !persistedState.tasks) {
                        return { tasks: [] }; // Возвращаем пустой стор
                    }

                    // Полная перезапись всех задач с правильными полями
                    const orderCounters: Record<string, number> = {};

                    persistedState.tasks = persistedState.tasks.map((task: any) => {
                        const userId = task.userId || 'legacy_user';
                        const priority = task.priority || 'none';
                        const counterKey = `${userId}_${priority}`;

                        if (!orderCounters[counterKey]) {
                            orderCounters[counterKey] = 0;
                        }

                        return {
                            ...task,
                            userId: userId,
                            priority: priority,
                            orderIndex: orderCounters[counterKey]++
                        };
                    });
                }

                return persistedState;
            }
        }
    )
);