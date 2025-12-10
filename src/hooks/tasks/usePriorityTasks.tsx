// hooks/tasks/usePriorityTasks.tsx
import { useMemo } from 'react';
import { useTaskStore } from '../../store/TaskStore.tsx';
import { useAuthStore } from '../../store/AuthStore.tsx';

type Priority = 'high' | 'medium' | 'low' | 'none';

export const usePriorityTasks = () => {
  const userId = useAuthStore(state => state.getUserId());
  const allTasks = useTaskStore(state => state.tasks);
  
  // 1. Базовые задачи пользователя (уже отсортированы по orderIndex для DnD)
  const userTasks = useMemo(() => {
    if (!userId) return [];
    return allTasks
      .filter(task => task.userId === userId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }, [allTasks, userId]);
  
  // 2. Для TaskList: плоский список, отсортированный по приоритету
  const sortedTasks = useMemo(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2, none: 3 };
    return [...userTasks].sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }, [userTasks]);
  
  // 3. Для TaskPriorityBoard: сгруппированные по приоритету
  const tasksByPriority = useMemo(() => {
    const result: Record<Priority, typeof userTasks> = {
      high: [], medium: [], low: [], none: []
    };
    userTasks.forEach(task => {
      const priority = task.priority || 'none';
      result[priority].push(task);
    });
    return result;
  }, [userTasks]);
  
  return {
    // Общее
    tasks: userTasks,
    total: userTasks.length,
    isLoadingPriorirty: !userId,
    
    // Для TaskList
    sortedTasks,
    
    // Для TaskPriorityBoard
    tasksByPriority
  };
};