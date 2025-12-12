import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Priority } from './../../types/task.types.ts';
import { useTaskNotifications } from './../../hooks/ui/useTaskNotification.tsx'
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

const PriorityMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentPriority: Priority;
  taskId: string | number;
  taskText: string;
  onPrioritySelect: (priority: Priority) => void;
  buttonRect?: DOMRect | null;
}> = ({ 
  isOpen, 
  onClose, 
  currentPriority, 
  onPrioritySelect,
  buttonRect 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !buttonRect) return null;

  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    top: `${buttonRect.bottom + 5}px`,
    left: `${buttonRect.left - 100}px`,
    zIndex: 9999,
    minWidth: '200px'
  };

  if (buttonRect.left - 100 < 10) {
    menuStyle.left = '10px';
  }

  if (buttonRect.bottom + 250 > window.innerHeight) {
    menuStyle.top = `${buttonRect.top - 250}px`;
  }

  return ReactDOM.createPortal(
    <>
      <div className="menu-overlay active" onClick={onClose} />
      <div 
        ref={menuRef}
        className="priority-menu active"
        style={menuStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="menu-title">Move to:</div>
        
        {(['high', 'medium', 'low', 'none'] as Priority[])
          .filter(priority => priority !== currentPriority)
          .map(priority => (
            <button
              key={priority}
              className={`menu-item ${priority}`}
              onClick={() => onPrioritySelect(priority)}
            >
              {priority === 'high' && '🔥 HIGH'}
              {priority === 'medium' && '⚡ MEDIUM'}
              {priority === 'low' && '🌱 LOW'}
              {priority === 'none' && '📋 NON-PRIORITY'}
            </button>
          ))
        }
        
        <button 
          className="menu-item close"
          onClick={onClose}
          style={{ marginTop: '10px', background: 'rgba(255,0,0,0.1)' }}
        >
          ✕ Cancel
        </button>
      </div>
    </>,
    document.body
  );
};

const SortableTask: React.FC<SortableTaskProps> = ({
  task,
  index,
  isMobile = false,
  onPriorityChange
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuButtonRect, setMenuButtonRect] = useState<DOMRect | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

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

  // 🔥 LONG PRESS ЛОГИКА
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    
    e.stopPropagation();
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    
    // Запускаем таймер long press
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPressing(true);
      if (navigator.vibrate) navigator.vibrate(30);
    }, 400); // 400ms (чуть раньше чем 500ms активация DnD)
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsLongPressing(false);
    touchStartRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !touchStartRef.current || !longPressTimerRef.current) return;
    
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartRef.current.y);
    
    // Если начали двигать, отменяем long press
    if (dx > 5 || dy > 5) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      setIsLongPressing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    WebkitUserSelect: 'none' as const,
    userSelect: 'none' as const,
    WebkitTapHighlightColor: 'transparent',
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isMenuOpen && menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuButtonRect(rect);
    }
    
    setIsMenuOpen(!isMenuOpen);
  };

  const handlePrioritySelect = (newPriority: Priority) => {
    console.log(`📱 Menu: Move task ${task.id} from ${task.priority} to ${newPriority}`);

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

    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isDragging) {
      setIsMenuOpen(false);
      setIsLongPressing(false);
    }
  }, [isDragging]);

  const showMenuButton = isMobile;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`task-card ${task.priority} ${isDragging ? 'dragging' : ''} ${isLongPressing ? 'long-press' : ''}`}
        {...attributes}
        {...listeners}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchCancel={handleTouchEnd}
      >
        <div className="task-content">
          <div className="task-text">
            {task.text}
            {isDragging && <span style={{ color: '#ff00ff', marginLeft: '8px' }}>🌀</span>}
            {isLongPressing && !isDragging && isMobile && (
              <div style={{
                fontSize: '10px',
                color: '#00ffff',
                marginTop: '4px',
                animation: 'pulse 1s infinite'
              }}>
                👆 Release to drag
              </div>
            )}
          </div>

          {showMenuButton && (
            <button
              ref={menuButtonRef}
              className="task-menu-button"
              onClick={toggleMenu}
              title="Change priority"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                e.stopPropagation();
                // Останавливаем long press при тапе на меню
                if (longPressTimerRef.current) {
                  clearTimeout(longPressTimerRef.current);
                  longPressTimerRef.current = null;
                }
                setIsLongPressing(false);
              }}
            >
              ⋮
            </button>
          )}
        </div>
      </div>

      {showMenuButton && (
        <PriorityMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          currentPriority={task.priority}
          taskId={task.id}
          taskText={task.text}
          onPrioritySelect={handlePrioritySelect}
          buttonRect={menuButtonRect}
        />
      )}
    </>
  );
};

export default SortableTask;