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
    clearTasksForCurrentUser: () => void;
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
                
                console.log(`🔄 Колонка ${priority} пересортирована`);
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
                
                console.log(`🚀 Задача ${taskId} перемещена в ${newPriority} на позицию ${newOrderIndex}`);
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

                // Находим задачи пользователя в колонке 'none'
                const userNoneTasks = get().tasks.filter(
                    task => task.userId === userId && task.priority === 'none'
                );

                const nextOrderIndex = userNoneTasks.length;

                set(state => ({
                    tasks: [...state.tasks, {
                        id: Date.now() + Math.random(),
                        text: text.trim(),
                        completed: false,
                        userId: userId,
                        createdAt: new Date().toISOString(),
                        priority: 'none',
                        orderIndex: nextOrderIndex
                    }]
                }));
                
                console.log(`✅ Задача добавлена в колонку "none" на позицию ${nextOrderIndex}`);
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

            clearTasksForCurrentUser: () => {
                console.log('🔄 Кэш задач очищен для смены пользователя');
            }
        }),

        // 🎯 PERSIST CONFIG
        {
            name: 'tasks-storage',
            version: 1, // Увеличиваем версию для миграции
            
            migrate: (persistedState: any, version: number) => {
                console.log('🔧 Запуск миграции задач, версия:', version);
                
                if (!persistedState || !persistedState.tasks) {
                    return persistedState;
                }

                // 1. Добавляем userId если нет (старая миграция)
                const hasUserId = persistedState.tasks[0]?.userId !== undefined;
                if (!hasUserId) {
                    console.log('🔧 Миграция: добавляем userId');
                    persistedState.tasks = persistedState.tasks.map((task: any) => ({
                        ...task,
                        userId: 'legacy_user'
                    }));
                }

                // 2. Добавляем priority и orderIndex если нет
                const hasPriority = persistedState.tasks[0]?.priority !== undefined;
                const hasOrderIndex = persistedState.tasks[0]?.orderIndex !== undefined;
                
                if (!hasPriority || !hasOrderIndex) {
                    console.log('🔧 Миграция: добавляем priority и orderIndex');
                    
                    // Группируем для подсчета orderIndex
                    const orderCounters: Record<string, number> = {};
                    
                    persistedState.tasks = persistedState.tasks.map((task: any) => {
                        const userId = task.userId || 'legacy_user';
                        const priority = task.priority || 'none';
                        const counterKey = `${userId}_${priority}`;
                        
                        if (!orderCounters[counterKey]) {
                            orderCounters[counterKey] = 0;
                        }
                        
                        const orderIndex = orderCounters[counterKey];
                        orderCounters[counterKey] += 1;
                        
                        return {
                            ...task,
                            priority: priority,
                            orderIndex: orderIndex,
                            userId: userId
                        };
                    });
                }
                
                console.log('✅ Миграция завершена');
                return persistedState;
            }
        }
    )
);

// 🔥 ХЕЛПЕР ДЛЯ ИНИЦИАЛИЗАЦИИ
export const initializeTaskStore = () => {
    console.log('📦 TaskStore инициализирован с поддержкой DnD');
};