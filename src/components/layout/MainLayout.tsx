import { ReactNode, useState, useEffect } from 'react';
import Notification from '../../ui/Notification.tsx';
import EditModal from './../tasks/EditModal.tsx';
import Header from './Header.tsx';
import AppNavigation from './AppNavigation.tsx';

interface MainLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

const MainLayout = ({ children, showNavigation = true }: MainLayoutProps) => {
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  
  // 1. Используем matchMedia для точного отслеживания медиа-запроса
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const mobile = e.matches;
      console.log('📱 Media query changed:', mobile);
      setIsMobile(mobile);
      
      // Сбрасываем sticky при переходе на мобилку
      if (mobile && isNavSticky) {
        console.log('📱 Переход на мобилку, сбрасываем sticky');
        setIsNavSticky(false);
      }
    };
    
    // Инициализируем
    handleMediaChange(mediaQuery);
    
    // Подписываемся на изменения
    mediaQuery.addEventListener('change', handleMediaChange);
    
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, [isNavSticky]); // Зависит от isNavSticky для сброса
  
  // 2. Отслеживаем скролл ТОЛЬКО на десктопе
  useEffect(() => {
    console.log('🔄 useEffect scroll, isMobile:', isMobile);
    
    if (isMobile) {
      // На мобилках гарантируем false
      if (isNavSticky) {
        console.log('📱 Принудительный сброс sticky на мобилке');
        setIsNavSticky(false);
      }
      return;
    }
    
    const handleScroll = () => {
      const shouldBeSticky = window.scrollY > 50;
      if (shouldBeSticky !== isNavSticky) {
        console.log('📜 Scroll change:', shouldBeSticky, 'scrollY:', window.scrollY);
        setIsNavSticky(shouldBeSticky);
      }
    };
    
    // Сразу проверяем текущее положение
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, isNavSticky]); // Зависит от обоих
  
  
  return (
    <>
      <Notification />
      <EditModal />
      
      {/* Header показываем ТОЛЬКО на десктопе */}
      {!isMobile && (
        <div className={isNavSticky ? 'header-hidden' : ''}>
          <Header />
        </div>
      )}
      
      {/* Передаем isSticky ТОЛЬКО на десктопе */}
      {showNavigation && (
        <AppNavigation isSticky={!isMobile && isNavSticky} />
      )}
      
      <main className="app-main">
        {children}
      </main>
    </>
  );
};

export default MainLayout;