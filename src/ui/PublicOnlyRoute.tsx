// /src/components/PublicOnlyRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore.tsx';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  /**
   * Куда редиректить если уже авторизован
   * @default '/'
   */
  redirectTo?: string;
}

/**
 * 🌐 PublicOnlyRoute - только для неавторизованных пользователей
 * 
 * Используется для страниц логина, регистрации
 */
export const PublicOnlyRoute = ({ 
  children, 
  redirectTo = '/' 
}: PublicOnlyRouteProps) => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();
  
  if (token) {
    const from = (location.state as any)?.from || redirectTo;
    return <Navigate to={from} replace />;
  }
  
  return <>{children}</>;
};