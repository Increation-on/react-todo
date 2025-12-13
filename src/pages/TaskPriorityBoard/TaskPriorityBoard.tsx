import React, { useCallback, useState, useEffect } from 'react';
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
  
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const mobile = e.matches;
      setIsMobile(mobile);
    };
    
    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaChange);
    
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);
  
  const columnOrder = isMobile 
    ? ['none', 'high', 'medium', 'low'] as const
    : ['high', 'medium', 'low', 'none'] as const;

  const { reorderTasksInColumn, updateTaskPriority } = useTaskStore();
  const getUserId = useAuthStore(state => state.getUserId);
  
  // Функция для DnD перемещения
  const handleDragComplete = useCallback((result: any) => {
    const userId = getUserId();
    if (!userId) {
      console.error('Пользователь не авторизован');
      return;
    }
    
    if (!result || !result.newTasks) {
      console.error('Нет данных о задачах в результате DnD');
      return;
    }
    
    const { newTasks, changes } = result;
  
    if (!changes) {
      console.error('❌ changes отсутствует!');
      return;
    }
    
    if (changes.priorityChanges && Array.isArray(changes.priorityChanges)) {
      changes.priorityChanges.forEach((change: any, index: number) => {
        if (change && change.taskId && change.toPriority) {
          updateTaskPriority(
            change.taskId, 
            change.toPriority, 
            change.newOrderIndex || 0
          );
        }
      });
    }
    
    if (changes.reorderedColumns && Array.isArray(changes.reorderedColumns)) {
      
      changes.reorderedColumns.forEach((priority: Priority) => {
        const columnTasks = newTasks[priority]
        if (columnTasks && columnTasks.length > 0) {
          const taskIdsInOrder = columnTasks.map((task: any) => task.id)
          reorderTasksInColumn(priority, taskIdsInOrder)
        }
      });
    }
  }, [reorderTasksInColumn, updateTaskPriority, getUserId]);

  // 🆕 Функция для перемещения через меню
  const handleMoveTask = useCallback((taskId: string | number, newPriority: Priority) => {
    const userId = getUserId();
    if (!userId) {
      console.error('Пользователь не авторизован');
      return;
    }
    updateTaskPriority(taskId, newPriority, 0);
  }, [updateTaskPriority, getUserId]);

  const {
    orderedTasks,
    dragOverColumn,
    sensors,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleDragCancel,
    activeTask
  } = useTaskDnD({
    initialTasks: tasksByPriority,
    onDragComplete: handleDragComplete
  });

  if (isLoadingPriorirty) return <div className="board-loading">Loading...</div>;
  if (total === 0) return <div className="board-empty">No tasks...</div>;

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
        {columnOrder.map((priority) => (
          <SortableContext
            key={priority}
            items={orderedTasks[priority]?.map(t => t.id.toString()) || []}
            strategy={verticalListSortingStrategy}
          >
            <PriorityColumn
              priority={priority}
              tasks={orderedTasks[priority] || []}
              isDragOver={dragOverColumn === priority}
              isMobile={isMobile}
              onMoveTask={handleMoveTask} // 🆕 Передаем функцию
            />
          </SortableContext>
        ))}
      </div>
      
      <TaskDragOverlay activeTask={activeTask} />
    </DndContext>
  );
};

export default TaskPriorityBoard;