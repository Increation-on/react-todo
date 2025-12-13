import React, { useState, useRef, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Priority } from './../../types/task.types.ts';
import { useTaskNotifications } from './../../hooks/ui/useTaskNotification.tsx'
import MobilePriorityMenu from '../../ui/MobilePriorityMenu.tsx'
import './../../styles/SortableTask.css'

interface SortableTaskProps {
  task: {
    id: number | string;
    text: string;
    priority: Priority;
  };
  index: number;
  isMobile?: boolean;
  onPriorityChange?: (taskId: string | number, newPriority: Priority) => void;
}

const SortableTask: React.FC<SortableTaskProps> = ({
  task,
  index,
  isMobile = false,
  onPriorityChange
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { info } = useTaskNotifications();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id.toString(),
    data: {
      type: 'task',
      priority: task.priority,
      taskId: task.id,
      index: index
    }
  });

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isMenuOpen && menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const handlePrioritySelect = (newPriority: Priority) => {
    const priorityNames: Record<Priority, string> = {
      none: 'Non-priority',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    };

    const priorityEmoji: Record<Priority, string> = {
      none: '⚪',
      low: '🟢',
      medium: '🟡',
      high: '🟠',
    };

    const taskText = task.text.length > 30
      ? task.text.substring(0, 30) + '...'
      : task.text;

    info(`"${taskText}" moved to ${priorityEmoji[newPriority]} ${priorityNames[newPriority]}`);

    if (onPriorityChange) {
      onPriorityChange(task.id, newPriority);
    }
  };

  useEffect(() => {
    if (isDragging) {
      setIsMenuOpen(false);
    }
  }, [isDragging]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const showMenuButton = isMobile;
  const menuButtonRect = menuButtonRef.current?.getBoundingClientRect();

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`task-card ${task.priority} ${isDragging ? 'dragging' : ''}`}
        {...attributes}
        {...listeners}
      >
        <div className="task-content">
          <div className="task-text">
            {task.text}
            {isDragging && <span style={{ color: '#ff00ff', marginLeft: '8px' }}>🌀</span>}
          </div>

          {showMenuButton && (
            <button
              ref={menuButtonRef}
              className="task-menu-button"
              onClick={toggleMenu}
              title="Change priority"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              ⋮
            </button>
          )}
        </div>
      </div>

      {showMenuButton && (
        <MobilePriorityMenu
          isOpen={isMenuOpen}
          onClose={() => {
            setIsMenuOpen(false);
          }}
          currentPriority={task.priority}
          onPrioritySelect={handlePrioritySelect}
          triggerRect={menuButtonRect}
        />
      )}
    </>
  );
};

export default SortableTask;