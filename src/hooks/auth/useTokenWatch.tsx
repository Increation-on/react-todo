import { useEffect } from 'react';
import { useAuthStore } from '../../store/AuthStore.tsx';

/**
 * Хук для управления слежением за токеном авторизации
 * Автоматически запускает и останавливает слежение при изменении токена
 */
export const useTokenWatch = (): void => {
  const token = useAuthStore((state) => state.token);
  const startTokenWatch = useAuthStore((state) => state.startTokenWatch);

  useEffect(() => {
    if (token) {
      console.log('🔐 [useTokenWatch] Токен обнаружен, запускаем слежение');
      const cleanup = startTokenWatch();
      
      // Возвращаем функцию очистки для остановки слежения
      return cleanup;
    }
    
    // Если токена нет, ничего не делаем
    console.log('🔐 [useTokenWatch] Токен отсутствует, слежение не запускается');
  }, [token, startTokenWatch]);
};