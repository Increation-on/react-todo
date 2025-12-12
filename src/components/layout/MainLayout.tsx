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
      const shouldBeSticky = window.scrollY > 10;
      if (shouldBeSticky !== isNavSticky) {
        setIsNavSticky(shouldBeSticky);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, isNavSticky]);
  
  return (
    <>
      <Notification />
      <EditModal />
      
      {/* Header: показываем только на десктопе */}
      {!isMobile && (
        <div className={isNavSticky ? 'header-hidden' : ''}>
          <Header />
        </div>
      )}
      
      {/* Navigation: всегда показываем */}
      {showNavigation && (
        <AppNavigation isSticky={!isMobile && isNavSticky} />
      )}
      
      {/* Контент */}
      <main className="app-main">
        {children}
      </main>
    </>
  );
};

export default MainLayout;