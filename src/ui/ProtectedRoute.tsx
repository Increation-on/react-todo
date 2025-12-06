// /src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore.tsx';
interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Куда редиректить если не авторизован
   * @default '/login'
   */
  redirectTo?: string;
  /**
   * Показывать загрузку (если нужно проверять токен с сервера)
   * @default false
   */
  showLoading?: boolean;
}

/**
 * 🔐 ProtectedRoute - защищает приватные маршруты
 * 
 * Паттерн: Route Guard / Higher-Order Component
 * 
 * 📌 Использование:
 * <ProtectedRoute>
 *   <SomePrivatePage />
 * </ProtectedRoute>
 */
export const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login',
  showLoading = false
}: ProtectedRouteProps) => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();
  
  // 🎯 Логирование для отладки (потом убрать)
  console.log('🛡️ ProtectedRoute:', {
    path: location.pathname,
    hasToken: !!token,
    timestamp: new Date().toISOString()
  });

  // ⏳ Загрузка (если нужно проверять токен с сервером)
  if (showLoading) {
    // Можно добавить проверку валидности токена
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Проверка авторизации...
      </div>
    );
  }

  // 🚫 Нет токена - редирект на логин
  if (!token) {
    console.log('🚫 Доступ запрещен, редирект на:', redirectTo);
    
    return (
      <Navigate 
        to={redirectTo} 
        state={{ 
          from: location.pathname, // Сохраняем откуда пришли
          message: 'Требуется авторизация'
        }} 
        replace 
      />
    );
  }

  // ✅ Есть токен - показываем контент
  return <>{children}</>;
};

// Опционально: создаем псевдоним для удобства
export const PrivateRoute = ProtectedRoute;