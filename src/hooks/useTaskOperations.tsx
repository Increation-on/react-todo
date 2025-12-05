// hooks/useTaskOperations.ts
import { useCallback } from 'react';
import { useTaskStore } from '../store/TaskStore.tsx';
import { useTaskNotifications } from './useTaskNotification.tsx';
import { BaseTask } from '../types/task.types';

export const useTaskOperations = () => {
  const { toggleTask, deleteTask } = useTaskStore();
  const taskNotify = useTaskNotifications();

  const handleToggle = useCallback((task: BaseTask) => {
    toggleTask(task.id);
    taskNotify.toggled(task.text, !task.completed);
  }, [toggleTask, taskNotify]);

  const handleDelete = useCallback((task: BaseTask, options?: {
    onSuccess?: () => void;
    selectedTaskId?: string | number | null;
  }) => {
    taskNotify.confirmDelete(task.text, () => {
      deleteTask(task.id);
      options?.onSuccess?.();
    });
  }, [deleteTask, taskNotify]);

  return {
    handleToggle,
    handleDelete
  };
};