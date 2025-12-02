// /src/store/NotificationStore.ts
import { create } from 'zustand';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  variant: 'auth' | 'task' | 'system'; // Для будущего
}

interface NotificationStore {
  notifications: Notification[];
  showNotification: (
    variant: 'auth' | 'task' | 'system',
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info'
  ) => void;
  removeNotification: (id: number) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  
  showNotification: (variant, message, type) => {
    const id = Date.now();
    const newNotification = { id, variant, message, type };
    
    console.log('🔔 showNotification:', newNotification);
    
    set(state => ({
      notifications: [...state.notifications, newNotification]
    }));
    
    // Автоудаление через 2 секунды
    setTimeout(() => {
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }));
    }, 2000);
    
    return id;
  },
  
  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
  
  clearNotifications: () => {
    set({ notifications: [] });
  }
}));