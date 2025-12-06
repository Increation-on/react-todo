import { useEffect, useState, useCallback } from 'react'; // Добавляем useCallback
import { useNotificationStore } from '../store/NotificationStore.tsx';
import './../styles/Notification.css'

const Notification = () => {
  const { notifications, removeNotification } = useNotificationStore();
  const [removingIds, setRemovingIds] = useState<number[]>([]);
  
  // Берем ВСЕ уведомления
  const allNotifications = notifications;
  
  // Выносим handleRemove в useCallback
  const handleRemove = useCallback((id: number) => {
    setRemovingIds(prev => [...prev, id]);
    
    setTimeout(() => {
      removeNotification(id);
      setRemovingIds(prev => prev.filter(removeId => removeId !== id));
    }, 300);
  }, [removeNotification]); // Зависимость от removeNotification
  
  // Используем handleRemove в useEffect
  useEffect(() => {
    allNotifications.forEach(notification => {
      const timer = setTimeout(() => {
        handleRemove(notification.id);
      }, notification.duration || 5000);
      
      return () => clearTimeout(timer);
    });
  }, [allNotifications, handleRemove]); // Добавляем handleRemove в зависимости
  
  const handleClose = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    handleRemove(id);
  };
  
  if (allNotifications.length === 0) {
    return null;
  }
  
  return (
    <div className="notifications-container">
      {allNotifications.map(notification => {
        // Определяем иконку по variant
        let icon = '●';
        if (notification.variant === 'auth') icon = '🔐';
        if (notification.variant === 'task') icon = '📝';
        if (notification.variant === 'system') icon = '⚙️';
        
        // Есть ли actions в уведомлении?
        const hasActions = notification.actions && notification.actions.length > 0;
        
        return (
          <div 
            key={notification.id}
            className={`
              notification
              notification--${notification.type}
              ${hasActions ? 'notification--with-actions' : ''}
              ${removingIds.includes(notification.id) ? 'removing' : ''}
            `}
          >
            {/* Основное содержимое уведомления */}
            <div className="notification__content">
              <span className="notification__icon">{icon}</span>
              
              <span className="notification__message">
                {notification.message}
              </span>
              
              {/* Кнопка закрытия (только если нет actions) */}
              {!hasActions && (
                <button 
                  className="notification__close"
                  onClick={(e) => handleClose(notification.id, e)}
                  aria-label="Закрыть уведомление"
                >
                  ×
                </button>
              )}
            </div>
            
            {/* Кнопки действий (если есть) */}
            {hasActions && notification.actions && (
              <div className="notification__actions">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    className={`
                      notification__action-button
                      notification__action-button--${action.type || 'secondary'}
                    `}
                    onClick={() => {
                      // Вызываем обработчик действия
                      action.onClick();
                      // Закрываем уведомление
                      handleRemove(notification.id);
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Notification;