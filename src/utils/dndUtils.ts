// utils/dndUtils.ts
import { TasksByPriority, Priority, Task } from '../types/task.types.ts';
import { arrayMove } from '@dnd-kit/sortable';

// ✅ Константа для типов
const PRIORITIES: Priority[] = ['high', 'medium', 'low', 'none'];

// 1. Нормализация задач
export const normalizeTasks = (tasks: Partial<TasksByPriority>): TasksByPriority => ({
  high: tasks.high || [],
  medium: tasks.medium || [],
  low: tasks.low || [],
  none: tasks.none || []
});

// 2. Поиск задачи по ID
export const findTaskById = (tasks: TasksByPriority, taskId: string): Task | null => {
  for (const priority of PRIORITIES) {
    const task = tasks[priority].find(t => t.id.toString() === taskId);
    if (task) return task;
  }
  return null;
};

// 3. Перемещение внутри колонки
export const reorderWithinColumn = (
  tasks: TasksByPriority,
  column: Priority,
  activeId: string,
  overId: string
): { newTasks: TasksByPriority; reorderedColumn: Priority | null } => {
  const columnTasks = [...tasks[column]];
  const oldIndex = columnTasks.findIndex(t => t.id.toString() === activeId);
  const newIndex = columnTasks.findIndex(t => t.id.toString() === overId);
  
  if (oldIndex === -1 || newIndex === -1) {
    return { newTasks: tasks, reorderedColumn: null };
  }
  
  const newTasks: TasksByPriority = {
    ...tasks,
    [column]: arrayMove(columnTasks, oldIndex, newIndex)
  };
  
  return { newTasks, reorderedColumn: column };
};

// 4. Перемещение между колонками (ИСПРАВЛЕННАЯ ВЕРСИЯ)
// ТОЛЬКО функция moveBetweenColumns в dndUtils.ts
export const moveBetweenColumns = (
  tasks: TasksByPriority,
  sourceColumn: Priority,
  targetColumn: Priority,
  taskId: string
): { 
  newTasks: TasksByPriority; 
  priorityChange: {
    taskId: string | number;
    fromPriority: Priority;
    toPriority: Priority;
    newOrderIndex: number;
  } | null; // ✅ Может быть null
  reorderedColumns: Priority[];
} => {
  const taskToMove = tasks[sourceColumn].find(t => t.id.toString() === taskId);
  
  if (!taskToMove) {
    return { 
      newTasks: tasks, 
      priorityChange: null, // ✅ null если задача не найдена
      reorderedColumns: [] 
    };
  }
  
  // Удаляем из исходной колонки
  const newSourceColumn = tasks[sourceColumn].filter(
    t => t.id.toString() !== taskId
  );
  
  // Добавляем в целевую колонку (в начало)
  const updatedTask: Task = {
    ...taskToMove,
    priority: targetColumn
  };
  
  const newTargetColumn = [updatedTask, ...tasks[targetColumn]];
  
  const newTasks: TasksByPriority = {
    ...tasks,
    [sourceColumn]: newSourceColumn,
    [targetColumn]: newTargetColumn
  };
  
  const priorityChange = {
    taskId: taskToMove.id,
    fromPriority: sourceColumn,
    toPriority: targetColumn,
    newOrderIndex: 0
  };
  
  return { 
    newTasks, 
    priorityChange, 
    reorderedColumns: [sourceColumn, targetColumn] as Priority[] // ✅ Явное приведение
  };
};

// 5. Создание результата DnD
export const createDragResult = (
  newTasks: TasksByPriority,
  priorityChanges: Array<{
    taskId: string | number;
    fromPriority: Priority;
    toPriority: Priority;
    newOrderIndex: number;
  }> = [],
  reorderedColumns: Priority[] = []
) => ({
  newTasks,
  changes: {
    priorityChanges,
    reorderedColumns
  }
});