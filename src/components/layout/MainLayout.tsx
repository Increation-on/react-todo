import { ReactNode, useState, useEffect, useLayoutEffect } from 'react';
import Notification from '../../ui/Notification.tsx';
import EditModal from './../tasks/EditModal.tsx';
import Header from './Header.tsx';
import AppNavigation from './AppNavigation.tsx';

interface MainLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

const MainLayout = ({ children, showNavigation = true }: MainLayoutProps) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [mainStyle, setMainStyle] = useState<React.CSSProperties>({});
  
  // 🔥 Устанавливаем стили ДО рендера
  useLayoutEffect(() => {
    const initialMargin = isMobile ? '60px' : '30px';
    setMainStyle({
      marginTop: initialMargin,
      minHeight: '100vh',
      transition: 'margin-top 0.3s ease'
    });
    
    // Скролл в начало
    window.scrollTo(0, 0);
    
    // Очищаем классы
    document.querySelectorAll('.header-hidden').forEach(el => {
      el.classList.remove('header-hidden');
    });
  }, [isMobile]);
  
  // Определение мобилки
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);
  
  // Логика sticky
  useEffect(() => {
    if (isMobile) return;
    
    const handleScroll = () => {
      const shouldBeSticky = window.scrollY > 20;
      
      if (shouldBeSticky !== isNavSticky) {
        setIsNavSticky(shouldBeSticky);
        
        // Обновляем inline стиль
        setMainStyle(prev => ({
          ...prev,
          marginTop: shouldBeSticky ? '120px' : '30px'
        }));
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Проверяем начальное состояние
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, isNavSticky]);
  
  return (
    <>
      <Notification />
      <EditModal />
      
      {/* Header: показываем только на десктопе */}
      {!isMobile && (
        <Header className={isNavSticky ? 'header-hidden' : ''} />
      )}
      
      {/* Navigation: всегда показываем */}
      {showNavigation && (
        <AppNavigation isSticky={!isMobile && isNavSticky} />
      )}
      
      {/* Контент с inline стилем */}
      <main className="app-main" style={mainStyle}>
        {children}
      </main>
    </>
  );
};

export default MainLayout;