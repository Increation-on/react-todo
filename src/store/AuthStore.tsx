// /src/store/authStore.ts
import { create } from 'zustand'
import { createMockJWT, parseMockJWT } from '../utils/mockJWT.tsx'
import { useNotificationStore } from './NotificationStore.tsx'

interface User {
  id: string;
  email: string;
  password: string;
}

interface AuthStore {
  token: string | null;
  currentUser: { email: string; expires: number } | null;
  
  // Методы
  getUsers: () => User[];
  getCurrentUser: () => { email: string; expires: number } | null;
  register: (email: string, password: string) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isLoggedIn: () => boolean;
  getUserId: () => string | null;
  startTokenWatch: () => () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => {
  // Вспомогательная функция для показа уведомлений
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setTimeout(() => {
      const notificationStore = useNotificationStore.getState();
      if (notificationStore?.showNotification) {
        notificationStore.showNotification('auth', message, type);
      }
    }, 0);
  };

  // Функция авто-выхода
  const performAutoLogout = () => {
    localStorage.removeItem('token');
    set({ token: null, currentUser: null });
    showNotification('Сессия истекла. Пожалуйста, войдите снова.', 'warning');
    window.dispatchEvent(new CustomEvent('authExpired'));
  };

  return {
    token: localStorage.getItem('token'),
    currentUser: null,
    
    getUsers: () => {
      return JSON.parse(localStorage.getItem('users') || '[]');
    },
    
    getCurrentUser: () => {
      if (!get().isLoggedIn()) return null;
      const token = localStorage.getItem('token');
      const payload = parseMockJWT(token!);
      return { email: payload.email, expires: payload.expires };
    },
    
    register: (email: string, password: string) => {
      const users = get().getUsers();
      const existingUser = users.find(user => user.email === email);
      
      if (existingUser) {
        showNotification('Пользователь с таким email уже существует', 'error');
        return false;
      }
      
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newUser = { id: userId, email, password };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Автовход после регистрации
      const success = get().login(email, password);
      if (success) {
        showNotification('Регистрация успешна!', 'success');
      }
      
      return success;
    },
    
    login: (email: string, password: string) => {
      const users = get().getUsers();
      const user = users.find(user => 
        user.email === email && user.password === password
      );
      
      if (!user) {
        showNotification('Неверный email или пароль', 'error');
        return false;
      }
      
      // Создаём JWT на 120 минут (для теста можно поставить 10000 = 10 секунд)
      const expires = Date.now() + 7200000;
      const token = createMockJWT({
        userId: user.id,
        email: user.email,
        expires
      });
      
      localStorage.setItem('token', token);
      set({ 
        token, 
        currentUser: { email: user.email, expires } 
      });
      
      showNotification('Вход выполнен успешно!', 'success');
      return true;
    },
    
    logout: () => {
      localStorage.removeItem('token');
      set({ token: null, currentUser: null });
    },
    
    isLoggedIn: () => {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      const payload = parseMockJWT(token);
      if (!payload) return false;
      
      if (Date.now() > payload.expires) {
        performAutoLogout();
        return false;
      }
      
      return true;
    },
    
    getUserId: () => {
      const token = get().token;
      if (!token) return null;
      
      const payload = parseMockJWT(token);
      return payload?.userId || null;
    },
    
    startTokenWatch: () => {
  
  const intervalId = setInterval(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      clearInterval(intervalId);
      return;
    }
    
    const payload = parseMockJWT(token);
    if (!payload || Date.now() > payload.expires) {
      clearInterval(intervalId);
      localStorage.removeItem('token');
      set({ token: null, currentUser: null });
      
      // Уведомление через setTimeout чтобы избежать цикла
      setTimeout(() => {
        const store = useNotificationStore.getState();
        store?.showNotification?.('auth', 'Сессия истекла', 'warning');
      }, 100);
      
      window.dispatchEvent(new CustomEvent('authExpired'));
    }
  }, 30000); 
  
  return () => {
    clearInterval(intervalId);
  };
}
  };
});