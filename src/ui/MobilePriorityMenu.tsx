import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Priority } from './../types/task.types.ts';
import './../styles/MobilePriorityMenu.css'

interface MobilePriorityMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPriority: Priority;
  onPrioritySelect: (priority: Priority) => void;
  triggerRect?: DOMRect | null;
}

const MobilePriorityMenu: React.FC<MobilePriorityMenuProps> = ({
  isOpen,
  onClose,
  currentPriority,
  onPrioritySelect,
  triggerRect
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Блокируем скролл страницы при открытом меню
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !triggerRect) return null;

  // Позиционирование меню для десктопа
  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    minWidth: '200px'
  };

  // Только для десктопа используем позиционирование относительно кнопки
  const isMobile = window.innerWidth <= 768;
  if (!isMobile) {
    menuStyle.top = `${triggerRect.bottom + 5}px`;
    menuStyle.left = `${Math.min(
      triggerRect.left,
      window.innerWidth - 220
    )}px`;

    // Если меню выходит за нижний край экрана - показываем сверху
    if (triggerRect.bottom + 300 > window.innerHeight) {
      menuStyle.top = `${triggerRect.top - 300}px`;
    }

    // Если меню выходит за правый край экрана
    if (triggerRect.left + 220 > window.innerWidth) {
      menuStyle.left = `${window.innerWidth - 220}px`;
    }
  }

  return ReactDOM.createPortal(
    <>
      <div 
        className={`menu-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose} 
      />
      <div 
        ref={menuRef}
        className={`priority-menu ${isOpen ? 'active' : ''}`}
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
              onClick={() => {
                console.log('🔍 Menu item clicked:', priority);
                onPrioritySelect(priority);
                onClose();
              }}
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
        >
          ✕ Cancel
        </button>
      </div>
    </>,
    document.body
  );
};

export default MobilePriorityMenu;