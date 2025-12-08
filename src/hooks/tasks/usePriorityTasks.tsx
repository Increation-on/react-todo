import { useMemo } from 'react';
import { useTaskStore } from '../../store/TaskStore.tsx';
import { useAuthStore } from '../../store/AuthStore.tsx';

type Priority = 'high' | 'medium' | 'low' | 'none';

export const usePriorityTasks = () => {
  const userId = useAuthStore((state) => state.getUserId());
  const allTasks = useTaskStore((state) => state.tasks);

  // 1. Задачи текущего пользователя
  const userTasks = useMemo(() => {
    if (!userId) return [];
    return allTasks.filter(task => task.userId === userId);
  }, [allTasks, userId]);

  // 2. Добавляем priority по умолчанию
  const tasksWithPriority = useMemo(() => 
    userTasks.map(task => ({
      ...task,
      priority: (task as any).priority || 'none' as Priority,
    })), 
    [userTasks]
  );

  // 3. Группируем по приоритетам
  const tasksByPriority = useMemo(() => {
    const result: Record<Priority, typeof tasksWithPriority> = {
      high: [],
      medium: [],
      low: [],
      none: [],
    };
    
    tasksWithPriority.forEach(task => {
      const priority = task.priority as Priority;
      result[priority].push(task);
    });
    
    return result;
  }, [tasksWithPriority]);

  return {
    tasks: tasksWithPriority,
    tasksByPriority,
    total: tasksWithPriority.length,
    isLoading: !userId,
  };
};