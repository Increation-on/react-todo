import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  DragEndEvent, 
  DragStartEvent,
  DragMoveEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { TasksByPriority, Priority, Task } from './../../types/task.types.ts';
import { 
  normalizeTasks, 
  findTaskById, 
  reorderWithinColumn, 
  moveBetweenColumns,
  createDragResult
} from '../../utils/dndUtils.ts';

export interface DragResult {
  newTasks: TasksByPriority;
  changes: {
    priorityChanges: Array<{
      taskId: string | number;
      fromPriority: Priority;
      toPriority: Priority;
      newOrderIndex: number;
    }>;
    reorderedColumns: Priority[];
  };
}

interface UseTaskDnDProps {
  initialTasks: TasksByPriority;
  onDragComplete?: (result: DragResult) => void;
}

interface UseTaskDnDReturn {
  orderedTasks: TasksByPriority;
  activeTask: Task | null;
  dragOverColumn: Priority | null;
  sensors: ReturnType<typeof useSensors>;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragMove: (event: DragMoveEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
}

export const useTaskDnD = ({ 
  initialTasks, 
  onDragComplete 
}: UseTaskDnDProps): UseTaskDnDReturn => {
  const [orderedTasks, setOrderedTasks] = useState<TasksByPriority>(() => 
    normalizeTasks(initialTasks)
  );
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Priority | null>(null);

  // 🔥 РАЗДЕЛЬНЫЕ СЕНСОРЫ: MouseSensor для десктопа, TouchSensor для мобилок
  const sensors = useSensors(
    // Мышь: работает мгновенно
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 3,
      }
    }),
    // Тач: активируется через 500ms (long press)
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 500,      // Long press 500ms
        tolerance: 8,    // Допуск движения
      }
    })
  );

  useEffect(() => {
    setOrderedTasks(normalizeTasks(initialTasks));
  }, [initialTasks]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const taskId = event.active.id as string;
    const task = findTaskById(orderedTasks, taskId);
    
    if (task) {
      setActiveTask(task);
    }
    
    setDragOverColumn(null);
    console.log('🟢 Начало перетаскивания задачи:', taskId);
  }, [orderedTasks]);

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    const over = event.over;
    const overData = over?.data.current;
    
    if (overData?.type === 'column' || overData?.type === 'task') {
      setDragOverColumn(overData.priority);
    } else {
      setDragOverColumn(null);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);
    setDragOverColumn(null);
    
    if (!over || !active.data.current || !over.data.current) {
      console.log('❌ Перетаскивание отменено');
      return createDragResult(orderedTasks);
    }

    const activeData = active.data.current;
    const overData = over.data.current;
    
    console.log('📊 Перетаскивание:', {
      from: activeData.priority,
      to: overData.priority,
      type: overData.type
    });

    let newTasks = orderedTasks;
    const priorityChanges: Array<{
      taskId: string | number;
      fromPriority: Priority;
      toPriority: Priority;
      newOrderIndex: number;
    }> = [];
    const reorderedColumns: Priority[] = [];

    if (activeData.priority === overData.priority && overData.type === 'task') {
      const result = reorderWithinColumn(
        orderedTasks, 
        activeData.priority, 
        active.id as string, 
        over.id as string
      );
      newTasks = result.newTasks;
      if (result.reorderedColumn) {
        reorderedColumns.push(result.reorderedColumn);
      }
    } 
    else if (activeData.priority !== overData.priority) {
      const result = moveBetweenColumns(
        orderedTasks,
        activeData.priority,
        overData.priority,
        active.id as string
      );
      newTasks = result.newTasks;
      
      if (result.priorityChange && result.priorityChange.taskId !== '') {
        priorityChanges.push(result.priorityChange);
      }
      
      reorderedColumns.push(...result.reorderedColumns);
    }

    setOrderedTasks(newTasks);
    const result = createDragResult(newTasks, priorityChanges, reorderedColumns);
    
    if (onDragComplete) {
      onDragComplete(result);
    }
    
    console.log('✅ Перетаскивание завершено');
    return result;
    
  }, [orderedTasks, onDragComplete]);

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
    setDragOverColumn(null);
    console.log('🟡 Перетаскивание отменено');
  }, []);

  return {
    orderedTasks,
    activeTask,
    dragOverColumn,
    sensors,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleDragCancel
  };
};