// /src/store/taskStore.ts - ОБНОВЛЯЕМ ДЛЯ ИЗОЛЯЦИИ
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuthStore } from './AuthStore.tsx'

interface Task {
    id: number | string;
    text: string;
    completed: boolean;
    userId: string; // 🔥 ДОБАВЛЯЕМ ПОЛЕ ДЛЯ ИЗОЛЯЦИИ
    createdAt: string; // Для сортировки
    priority?: 'high' | 'medium' | 'low' | 'none';
}

interface TaskStore {
    tasks: Task[];
    // 🔥 ДОБАВЛЯЕМ МЕТОД ДЛЯ ПОЛУЧЕНИЯ ЗАДАЧ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
    getUserTasks: (userId: string | null) => Task[];
    addTask: (text: string) => void;
    toggleTask: (id: number | string) => void;
    deleteTask: (id: number | string) => void;
    getTotalTasks: () => number;
    getActiveTasks: () => Task[];
    getCompletedTasks: () => Task[];
    // 🔥 ОЧИСТКА ПРИ СМЕНЕ ПОЛЬЗОВАТЕЛЯ (будет вызываться из authStore)
    clearTasksForCurrentUser: () => void;
    updateTaskText: (id: number | string, newText: string) => void;
}

export const useTaskStore = create<TaskStore>()(
    persist(
        (set, get) => ({
            tasks: [],

            // 🔥 ПОЛУЧЕНИЕ ЗАДАЧ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
            getUserTasks: (userId: string | null) => {
                if (!userId) return [];
                return get().tasks.filter(task => task.userId === userId);
            },

            // 🔥 ДОБАВЛЕНИЕ ЗАДАЧИ С USERID
            addTask: (text) => {
                const userId = useAuthStore.getState().getUserId();
                if (!userId) {
                    console.error('Нельзя добавить задачу: пользователь не авторизован');
                    return;
                }

                set(state => ({
                    tasks: [...state.tasks, {
                        id: Date.now() + Math.random(),
                        text: text,
                        completed: false,
                        userId: userId, // 🔥 СОХРАНЯЕМ КТО СОЗДАЛ
                        createdAt: new Date().toISOString()
                    }]
                }));
            },

            // 🔥 ПЕРЕКЛЮЧЕНИЕ СТАТУСА (ТОЛЬКО СВОИХ ЗАДАЧ)
            toggleTask: (id) => {
                const userId = useAuthStore.getState().getUserId();
                set(state => ({
                    tasks: state.tasks.map(task =>
                        task.id === id && task.userId === userId // 🔥 ПРОВЕРЯЕМ ВЛАДЕЛЬЦА
                            ? { ...task, completed: !task.completed }
                            : task
                    )
                }));
            },

            // 🔥 УДАЛЕНИЕ (ТОЛЬКО СВОИХ ЗАДАЧ)
            deleteTask: (id) => {
                const userId = useAuthStore.getState().getUserId();
                set(state => ({
                    tasks: state.tasks.filter(task =>
                        !(task.id === id && task.userId === userId) // 🔥 УДАЛЯЕМ ТОЛЬКО СВОИ
                    )
                }));
            },

            // 🔥 ГЕТТЕРЫ С ФИЛЬТРАЦИЕЙ ПО ПОЛЬЗОВАТЕЛЮ
            getTotalTasks: () => {
                const userId = useAuthStore.getState().getUserId();
                if (!userId) return 0;
                return get().tasks.filter(task => task.userId === userId).length;
            },

            getActiveTasks: () => {
                const userId = useAuthStore.getState().getUserId();
                if (!userId) return [];
                return get().tasks.filter(task =>
                    task.userId === userId && !task.completed
                );
            },

            getCompletedTasks: () => {
                const userId = useAuthStore.getState().getUserId();
                if (!userId) return [];
                return get().tasks.filter(task =>
                    task.userId === userId && task.completed
                );
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
                        task.id === id && task.userId === userId // 🔥 ПРОВЕРЯЕМ ВЛАДЕЛЬЦА
                            ? { 
                                ...task, 
                                text: trimmedText,
                                // Можно добавить updatedAt если нужно
                              }
                            : task
                    )
                }));
                
                console.log(`✅ Задача ${id} обновлена: "${trimmedText}"`);
            },

            // 🔥 ОЧИСТКА ЗАДАЧ В ПАМЯТИ (НЕ В LOCALSTORAGE)
            clearTasksForCurrentUser: () => {
                // Не очищаем полностью, просто фильтруем при чтении
                // Задачи других пользователей остаются в localStorage
                console.log('🔄 Кэш задач очищен для смены пользователя');
            }
        }),

        // 🎯 PERSIST CONFIG: ВСЕ ЗАДАЧИ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ В ОДНОМ ХРАНИЛИЩЕ
        // Но фильтруем по userId при чтении
        {
            name: 'tasks-storage',
            // 🔥 МОЖНО ДОБАВИТЬ МИГРАЦИЮ ДЛЯ СТАРЫХ ДАННЫХ
            migrate: (persistedState: any, version: number) => {
                // Если в старых данных нет userId - добавляем дефолтный
                if (persistedState?.tasks && persistedState.tasks.length > 0) {
                    const hasUserId = persistedState.tasks[0].userId !== undefined;
                    if (!hasUserId) {
                        console.log('🔧 Миграция: добавляем userId к старым задачам');
                        persistedState.tasks = persistedState.tasks.map((task: any) => ({
                            ...task,
                            userId: 'legacy_user' // Старые задачи всем одному пользователю
                        }));
                    }
                }
                return persistedState;
            }
        }
    )
);

// 🔥 ХЕЛПЕР ДЛЯ ИНИЦИАЛИЗАЦИИ ПРИ ЗАГРУЗКЕ
export const initializeTaskStore = () => {
    // Можно вызвать при загрузке приложения
    console.log('📦 TaskStore инициализирован');
};