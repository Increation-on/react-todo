// 📁 /src/types/dnd.types.ts - УБИРАЕМ дублирование
import { Priority, TasksByPriority } from './task.types';

// ❌ УДАЛЯЕМ отсюда TasksByPriority, используем из task.types

export type DragOperationType = 'reorder' | 'move-between-columns';

export interface DragOperation {
  type: DragOperationType;
  activeId: string;
  overId: string;
  activeData: {
    type: 'task';
    priority: Priority;
    taskId: string | number;
    index: number;
  };
  overData: {
    type: 'task' | 'column';
    priority: Priority;
    taskId?: string | number;
    index?: number;
  };
}

export interface UseTaskDnDReturn {
  orderedTasks: TasksByPriority;
  setOrderedTasks: React.Dispatch<React.SetStateAction<TasksByPriority>>;
  processDrag: (event: any) => TasksByPriority;
  resetToInitial: () => void;
}