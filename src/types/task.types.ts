// /src/types/task.types.ts

export interface BaseTask {
  id: string | number;
  text: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Task extends BaseTask {
  // Можно добавить дополнительные поля если нужно
}

export interface TaskListViewTask {
  id: string | number;
  text: string;
  completed: boolean;
}

// Тип для операций с задачами
export type TaskOperation = 'create' | 'update' | 'delete' | 'toggle';

// Тип для фильтрации задач
export type TaskFilter = 'all' | 'active' | 'completed';

export type Priority = 'high' | 'medium' | 'low' | 'none';