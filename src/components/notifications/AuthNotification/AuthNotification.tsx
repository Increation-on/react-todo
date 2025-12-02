// /src/components/AuthNotification/AuthNotification.tsx
import { useNotificationStore } from '../../../store/NotificationStore.tsx';
import './AuthNotification.css';

const AuthNotification = () => {
  const { notifications, removeNotification } = useNotificationStore();
  
  // Берём только auth уведомления
  const authNotifications = notifications.filter(n => n.variant === 'auth');
  
  return (
    <>
      {authNotifications.map(notification => (
        <div 
          key={notification.id}
          className={`auth-notification auth-notification--${notification.type}`}
        >
          {notification.message}
          <button 
            className="auth-notification__close" 
            onClick={() => removeNotification(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </>
  );
};

export default AuthNotification;