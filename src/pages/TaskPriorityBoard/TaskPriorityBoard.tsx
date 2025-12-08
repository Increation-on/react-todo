import React, { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter 
} from '@dnd-kit/core';
import { 
  arrayMove,
  SortableContext,
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import PriorityColumn from './PriorityColumn.tsx';
import {usePriorityTasks} from './../../hooks/tasks/usePriorityTasks.tsx'
import './../../styles/TaskPriorityBoard.css';

const TaskPriorityBoard: React.FC = () => {
  const { tasksByPriority, total, isLoading } = usePriorityTasks();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Настройка сенсоров для мыши
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Минимальное расстояние для начала drag
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  console.log('🎯 Drag ENDED:', { 
    active: active.id, 
    over: over?.id,
    activeData: active.data.current,
    overData: over?.data.current
  });
  setActiveId(null);

  if (!over) {
    console.log('❌ Ничего под курсором');
    return;
  }

  if (active.id !== over.id) {
    console.log('✅ Задача перемещена с', active.id, 'на', over.id);
    
    // ВРЕМЕННО: просто алерт
    alert(`Задача ${active.id} перемещена на позицию ${over.id}\nЗавтра добавим сохранение в стор!`);
    
    // ЗАВТРА здесь будет:
    // 1. Найти задачу в сторе
    // 2. Обновить её порядок
    // 3. Сохранить в стор
    // 4. Компонент перерендерится с новым порядком
  }
};

  if (isLoading) {
    return <div className="board-loading">Загрузка...</div>;
  }

  if (total === 0) {
    return (
      <div className="board-empty">
        <p>Нет задач. Создайте первую задачу в колонке "Без приоритета"</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="priority-board">
        {(['high', 'medium', 'low', 'none'] as const).map((priority) => (
          <SortableContext
            key={priority}
            items={tasksByPriority[priority].map(t => t.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <PriorityColumn 
              priority={priority} 
              tasks={tasksByPriority[priority]} 
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
};

export default TaskPriorityBoard;