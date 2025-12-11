import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Priority } from './../../types/task.types.ts';
import './../../styles/TaskPriorityBoard.css';

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handlePrioritySelect = (newPriority: Priority) => {
    console.log(`📱 Menu: Move task ${task.id} from ${task.priority} to ${newPriority}`);
    
    if (onPriorityChange) {
      onPriorityChange(task.id, newPriority);
    }
    
    setIsMenuOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const menuElement = document.querySelector('.priority-menu');
    
    if (
      menuButtonRef.current && 
      !menuButtonRef.current.contains(e.target as Node) &&
      menuElement && 
      !menuElement.contains(e.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isDragging) {
      setIsMenuOpen(false);
    }
  }, [isDragging]);

  const showMenuButton = isMobile;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${task.priority} ${isDragging ? 'dragging' : ''} ${isMenuOpen ? 'menu-open' : ''}`}
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
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
          >
            ⋮
          </button>
        )}
      </div>

      {showMenuButton && isMenuOpen && (
        <div className="priority-menu">
          <div className="menu-title">Move to:</div>
          
          {(['high', 'medium', 'low', 'none'] as Priority[])
            .filter(priority => priority !== task.priority)
            .map(priority => (
              <button
                key={priority}
                className={`menu-item ${priority}`}
                onClick={() => handlePrioritySelect(priority)}
              >
                {priority === 'high' && '🔥 HIGH'}
                {priority === 'medium' && '⚡ MEDIUM'}
                {priority === 'low' && '🌱 LOW'}
                {priority === 'none' && '📋 NON-PRIORITY'}
              </button>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default SortableTask;