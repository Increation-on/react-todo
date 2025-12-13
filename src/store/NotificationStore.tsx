// /src/store/NotificationStore.ts

import { create } from 'zustand';

// Тип для действий в уведомлении
interface NotificationAction {
  label: string;
  onClick: () => void;
  type?: 'primary' | 'secondary';
}

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  variant: 'auth' | 'task' | 'system';
  duration?: number;
  actions?: NotificationAction[]; // ← ДОБАВИЛИ actions
}

interface NotificationStore {
  notifications: Notification[];
  showNotification: (
    variant: 'auth' | 'task' | 'system',
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info',
    duration?: number,
    actions?: NotificationAction[] // ← ДОБАВИЛИ actions параметр
  ) => number;
  removeNotification: (id: number) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  
  showNotification: (variant, message, type, duration = 5000, actions) => {
    const id = Date.now();
    const newNotification = { 
      id, 
      variant, 
      message, 
      type,
      duration,
      actions // ← Сохраняем actions
    };
    
    set(state => ({
      notifications: [...state.notifications, newNotification]
    }));
    
    // Автоудаление (только если нет actions)
    if (!actions || actions.length === 0) {
      setTimeout(() => {
        const { notifications } = get();
        if (notifications.some(n => n.id === id)) {
          set(state => ({
            notifications: state.notifications.filter(n => n.id !== id)
          }));
        }
      }, duration);
    }
    
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