import { ReactNode } from 'react';
import Notification from '../../ui/Notification.tsx';
import EditModal from './../tasks/EditModal.tsx'
import Header from './Header.tsx'
import AppNavigation from './AppNavigation.tsx'

interface MainLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

const MainLayout = ({ children, showNavigation = true }: MainLayoutProps) => {
  return (
    <>
      {/* Глобальные компоненты */}
      <Notification />
      <EditModal />
      
      {/* ШАПКА */}
      <Header />
      
      {/* НАВИГАЦИЯ (условно) */}
      {showNavigation && <AppNavigation />}
      
      {/* ОСНОВНОЕ СОДЕРЖИМОЕ */}
      <main className="app-main">
        {children}
      </main>
    </>
  );
};

export default MainLayout;