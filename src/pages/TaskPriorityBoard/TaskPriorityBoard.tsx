import React, { useCallback } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import PriorityColumn from './PriorityColumn.tsx';
import { usePriorityTasks } from './../../hooks/tasks/usePriorityTasks.tsx';
import { useTaskStore } from '../../store/TaskStore.tsx';
import { useAuthStore } from '../../store/AuthStore.tsx';
import { useTaskDnD } from '../../hooks/tasks/useTaskDnD.tsx';
import { TaskDragOverlay } from './TaskDragOverlay.tsx';
import './../../styles/TaskPriorityBoard.css';
import { Priority } from '../../types/task.types.ts';

const TaskPriorityBoard: React.FC = () => {
  const { tasksByPriority, total, isLoadingPriorirty } = usePriorityTasks();
  
  // Получаем методы из стора
  const { reorderTasksInColumn, updateTaskPriority } = useTaskStore();
  const getUserId = useAuthStore(state => state.getUserId);
  
  // Колбэк для сохранения в стор
 const handleDragComplete = useCallback((result: any) => {
    const userId = getUserId();
    if (!userId) {
      console.error('Пользователь не авторизован');
      return;
    }
    
    // Защита: проверяем что result существует
    if (!result || !result.newTasks) {
      console.error('Нет данных о задачах в результате DnD');
      return;
    }
    
    const { newTasks, changes } = result;
  
    if (!changes) {
      console.error('❌ changes отсутствует!');
      return;
    }
    
    // 1. Сначала обрабатываем изменение приоритетов (если есть)
    if (changes.priorityChanges && Array.isArray(changes.priorityChanges)) {
     
      
      changes.priorityChanges.forEach((change: any, index: number) => {
        if (change && change.taskId && change.toPriority) {
        
          
          // 🔥 ВЫЗЫВАЕМ updateTaskPriority
          updateTaskPriority(
            change.taskId, 
            change.toPriority, 
            change.newOrderIndex || 0
          );
        }
      });
    }
    
    // 2. Потом пересортировываем колонки
    if (changes.reorderedColumns && Array.isArray(changes.reorderedColumns)) {
      console.log(`📊 Пересортировка колонок: ${changes.reorderedColumns.join(', ')}`);
      
      changes.reorderedColumns.forEach((priority: Priority) => {
        const columnTasks = newTasks[priority];
        if (columnTasks && columnTasks.length > 0) {
          const taskIdsInOrder = columnTasks.map((task: any) => task.id);
          console.log(`📝 Колонка ${priority}: ${taskIdsInOrder.length} задач`);
          
          // 🔥 ВЫЗЫВАЕМ reorderTasksInColumn
          reorderTasksInColumn(priority, taskIdsInOrder);
        }
      });
    }
    
    console.log('✅ Изменения отправлены в стор');
}, [reorderTasksInColumn, updateTaskPriority, getUserId]);

  // Используем хук с колбэком (теперь без DragOverlay)
  const {
    orderedTasks,
    dragOverColumn,
    sensors,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleDragCancel,
    activeTask // 🔥 Получаем activeTask из хука
  } = useTaskDnD({
    initialTasks: tasksByPriority,
    onDragComplete: handleDragComplete
  });

  if (isLoadingPriorirty) return <div className="board-loading">Загрузка...</div>;
  if (total === 0) return <div className="board-empty">Нет задач...</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
      onDragCancel={handleDragCancel}
    >
      <div className="priority-board">
        {(['high', 'medium', 'low', 'none'] as const).map((priority) => (
          <SortableContext
            key={priority}
            items={orderedTasks[priority]?.map(t => t.id.toString()) || []}
            strategy={verticalListSortingStrategy}
          >
            <PriorityColumn
              priority={priority}
              tasks={orderedTasks[priority] || []}
              isDragOver={dragOverColumn === priority}
            />
          </SortableContext>
        ))}
      </div>
      
      {/* 🔥 Используем отдельный компонент DragOverlay */}
      <TaskDragOverlay activeTask={activeTask} />
    </DndContext>
  );
};

export default TaskPriorityBoard;