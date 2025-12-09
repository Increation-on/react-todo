import { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  DragEndEvent, 
  DragStartEvent,
  DragMoveEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay as DndDragOverlay
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { TasksByPriority, Priority, Task } from './../../types/task.types.ts'

// 🔥 НОВЫЕ ТИПЫ
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
  // Состояния
  orderedTasks: TasksByPriority;
  activeId: string | null;
  dragOverColumn: Priority | null;
  activeTask: Task | null;
  
  // DnD методы
  sensors: ReturnType<typeof useSensors>;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragMove: (event: DragMoveEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
  
  // Утилиты
  setOrderedTasks: React.Dispatch<React.SetStateAction<TasksByPriority>>;
  
  // Компонент
  DragOverlay: React.FC;
}

export const useTaskDnD = ({ 
  initialTasks, 
  onDragComplete 
}: UseTaskDnDProps): UseTaskDnDReturn => {
  // 🔥 СОСТОЯНИЯ
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Priority | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);


  const normalizeTasks = useCallback((tasks: TasksByPriority): TasksByPriority => ({
    high: tasks.high || [],
    medium: tasks.medium || [],
    low: tasks.low || [],
    none: tasks.none || []
  }), []);

  const [orderedTasks, setOrderedTasks] = useState<TasksByPriority>(() => 
    normalizeTasks(initialTasks)
  );

  // 🔥 СИНХРОНИЗАЦИЯ С ИСХОДНЫМИ ДАННЫМИ
  useEffect(() => {
    setOrderedTasks(normalizeTasks(initialTasks));
  }, [initialTasks, normalizeTasks]);

  // 🔥 НАСТРОЙКА СЕНСОРОВ
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // 🔥 ПОИСК ЗАДАЧИ ПО ID
  const findTaskById = useCallback((taskId: string): Task | null => {
    for (const priority of ['high', 'medium', 'low', 'none'] as const) {
      const task = orderedTasks[priority].find(t => t.id.toString() === taskId);
      if (task) return task;
    }
    return null;
  }, [orderedTasks]);

  // 🔥 ОБРАБОТЧИК НАЧАЛА ПЕРЕТАСКИВАНИЯ
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const taskId = event.active.id as string;
    setActiveId(taskId);
    setDragOverColumn(null);
    
    const task = findTaskById(taskId);
    if (task) {
      setActiveTask(task);
    }
    
    console.log('🟢 Начало перетаскивания задачи:', taskId);
  }, [findTaskById]);

  // 🔥 ОБРАБОТЧИК ДВИЖЕНИЯ ПРИ ПЕРЕТАСКИВАНИИ
  const handleDragMove = useCallback((event: DragMoveEvent) => {
    const over = event.over;
    
    if (!over) {
      setDragOverColumn(null);
      return;
    }
    
    const overData = over.data.current;
    if (!overData) {
      setDragOverColumn(null);
      return;
    }
    
    if (overData.type === 'column' || overData.type === 'task') {
      setDragOverColumn(overData.priority);
    } else {
      setDragOverColumn(null);
    }
  }, []);

  // 🔥 ОБРАБОТЧИК ЗАВЕРШЕНИЯ ПЕРЕТАСКИВАНИЯ (ОБНОВЛЁННЫЙ)
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    // Сбрасываем состояния
    setActiveId(null);
    setActiveTask(null);
    setDragOverColumn(null);
    
    if (!over) {
      console.log('❌ Перетаскивание отменено: нет целевого элемента');
      return { newTasks: orderedTasks, changes: { priorityChanges: [], reorderedColumns: [] } };
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || !overData) {
      console.log('❌ Нет данных о перетаскивании');
      return { newTasks: orderedTasks, changes: { priorityChanges: [], reorderedColumns: [] } };
    }

    console.log('📊 Данные перетаскивания:', {
      activePriority: activeData.priority,
      overPriority: overData.priority,
      overType: overData.type
    });

    let newTasks: TasksByPriority = { ...orderedTasks };
    const changes = {
      priorityChanges: [] as Array<{
        taskId: string | number;
        fromPriority: Priority;
        toPriority: Priority;
        newOrderIndex: number;
      }>,
      reorderedColumns: [] as Priority[]
    };

    // 1. Перемещение ВНУТРИ колонки
    if (activeData.priority === overData.priority && overData.type === 'task') {
      console.log('🔁 Перемещение внутри колонки:', activeData.priority);
      
      const columnTasks = [...newTasks[activeData.priority]];
      const oldIndex = columnTasks.findIndex(
        t => t.id.toString() === active.id
      );
      const newIndex = columnTasks.findIndex(
        t => t.id.toString() === over.id
      );
      
      if (oldIndex !== -1 && newIndex !== -1) {
        newTasks[activeData.priority] = arrayMove(columnTasks, oldIndex, newIndex);
        changes.reorderedColumns.push(activeData.priority);
      }
    }
    // 2. Перемещение МЕЖДУ колонками
    else if (activeData.priority !== overData.priority) {
      console.log('🚀 Перемещение между колонками:', 
        `${activeData.priority} → ${overData.priority}`);
      
      const sourceColumn = activeData.priority;
      const targetColumn = overData.priority;
      
      // Находим задачу
      const taskToMove = newTasks[sourceColumn].find(
        t => t.id.toString() === active.id
      );
      
      if (taskToMove) {
        // Добавляем информацию об изменении приоритета
        changes.priorityChanges.push({
          taskId: taskToMove.id,
          fromPriority: sourceColumn,
          toPriority: targetColumn,
          newOrderIndex: 0 // всегда в начало целевой колонки
        });
        
        // Удаляем из исходной
        newTasks[sourceColumn] = newTasks[sourceColumn].filter(
          t => t.id.toString() !== active.id
        );
        changes.reorderedColumns.push(sourceColumn);
        
        // Добавляем в целевую (ВСЕГДА В НАЧАЛО)
        const updatedTask: Task = {
          ...taskToMove,
          priority: targetColumn
        };
        
        newTasks[targetColumn] = [updatedTask, ...newTasks[targetColumn]];
        changes.reorderedColumns.push(targetColumn);
      }
    }
    // 3. Неизвестная операция
    else {
      console.log('⚠️ Неизвестная операция перетаскивания');
      return { newTasks: orderedTasks, changes: { priorityChanges: [], reorderedColumns: [] } };
    }

    // Обновляем состояние
    setOrderedTasks(newTasks);
    
    const result: DragResult = {
      newTasks,
      changes
    };
    
    // Вызываем колбэк если предоставлен
    if (onDragComplete) {
      console.log('🔄 Вызываем onDragComplete с изменениями:', changes);
      onDragComplete(result);
    }
    
    console.log('✅ Перетаскивание успешно завершено');
    
    return result;
    
  }, [orderedTasks, onDragComplete]);

  // 🔥 ОБРАБОТЧИК ОТМЕНЫ ПЕРЕТАСКИВАНИЯ
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveTask(null);
    setDragOverColumn(null);
    console.log('🟡 Перетаскивание отменено');
  }, []);

  // 🔥 КОМПОНЕНТ DRAG OVERLAY
  const DragOverlay = useMemo(() => {
    const OverlayComponent = () => (
      <DndDragOverlay>
        {activeTask && (
          <div style={{
            padding: '12px',
            background: '#1a1a2e',
            border: '2px solid #0ff',
            borderRadius: '8px',
            boxShadow: '0 0 25px rgba(0, 255, 255, 0.6)',
            opacity: 0.85,
            transform: 'rotate(2deg)',
            maxWidth: '250px',
            wordBreak: 'break-word'
          }}>
            <div style={{ 
              color: '#fff', 
              fontSize: '14px',
              textShadow: '0 0 5px #0ff'
            }}>
              {activeTask.text}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#0ff',
              marginTop: '4px',
              opacity: 0.8
            }}>
              Приоритет: {activeTask.priority}
            </div>
          </div>
        )}
      </DndDragOverlay>
    );
    
    OverlayComponent.displayName = 'TaskDragOverlay';
    return OverlayComponent;
  }, [activeTask]);

  return {
    // Состояния
    orderedTasks,
    activeId,
    dragOverColumn,
    activeTask,
    
    // DnD методы
    sensors,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleDragCancel,
    
    // Утилиты
    setOrderedTasks,
    
    // Компонент
    DragOverlay
  };
};