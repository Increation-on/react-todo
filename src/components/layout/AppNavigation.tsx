import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppNavigation } from '../../hooks/ui/useAppNavigation.tsx';
import { useAuthStore } from '../../store/AuthStore.tsx';
import LogoutButton from '../auth/LogoutButton.tsx';
import './../../styles/AppNavigation.css';

interface AppNavigationProps {
  isSticky?: boolean;
}

const AppNavigation = ({ isSticky = false }: AppNavigationProps) => {
  // По умолчанию: expanded на десктопе, collapsed на мобилках
  const [isExpanded, setIsExpanded] = useState(() => window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const navigationItems = useAppNavigation();
  const location = useLocation();
  
  // Получаем данные пользователя
  const getCurrentUser = useAuthStore(state => state.getCurrentUser);
  const currentUser = getCurrentUser();
  
  // Используем matchMedia для точного отслеживания медиа-запроса
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const mobile = e.matches;
      setIsMobile(mobile);
      
      // При переходе на мобилку сворачиваем, на десктоп - разворачиваем
      if (mobile) {
        setIsExpanded(false); // На мобилках по умолчанию collapsed
      } else {
        setIsExpanded(true); // На десктопе по умолчанию expanded
      }
    };
    
    // Инициализируем сразу
    handleMediaChange(mediaQuery);
    
    // Подписываемся на изменения
    mediaQuery.addEventListener('change', handleMediaChange);
    
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);
  
  if (navigationItems.length === 0) {
    return null;
  }
  
  const mainItems = navigationItems.filter(item => item.path !== '/priority');
  const priorityItem = navigationItems.find(item => item.path === '/priority');
  
  const toggleNavigation = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Закрываем навигацию при клике на ссылку (только на мобилках)
  const handleLinkClick = () => {
    if (isMobile) {
      setIsExpanded(false);
    }
  };
  
  const isPriorityPage = location.pathname === '/priority';
  
  // Определяем иконку в зависимости от isMobile
  const toggleIcon = isMobile 
    ? (isExpanded ? '▲' : '▼' )  // На мобилках: вертикальные стрелки 
    : (isExpanded ? '◀' : '▶'); // На десктопе: горизонтальные стрелки
  
  return (
    <div className={`app-navigation-wrapper ${isExpanded ? 'expanded' : 'collapsed'} ${isSticky ? 'sticky' : ''}`}>
      <button 
        className="nav-toggle-button"
        onClick={toggleNavigation}
        aria-label={isExpanded ? "Hide nav" : "Show nav"}
      >
        <div className="triangle-icon">
          {toggleIcon}
        </div>
      </button>
      
      {/* User info для мобилок */}
      {isMobile && currentUser && (
        <div className="mobile-user-info">
          <span className="mobile-user-email">
            {currentUser.email}
          </span>
          <div className="mobile-logout-wrapper">
            <LogoutButton compact={true} />
          </div>
        </div>
      )}
      
      <div className="nav-content">
        <nav className="main-navigation">
          {mainItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active-link' : ''}`
              }
              end={item.path === '/'}
              onClick={handleLinkClick} // Закрываем навигацию при клике
            >
              <span className="nav-link-text">{item.label}</span>
              {item.count !== undefined && (
                <span className="nav-link-count">({item.count})</span>
              )}
            </NavLink>
          ))}
        </nav>
        
        {priorityItem && (
          <div className={`priority-section ${isPriorityPage ? 'priority-active' : ''}`}>
            <NavLink 
              to={priorityItem.path} 
              className="priority-nav-link"
              onClick={handleLinkClick} // Закрываем навигацию при клике
            >
              <span className="priority-link-text">
                {priorityItem.label}
                {priorityItem.count !== undefined && (
                  <span className="priority-link-count">({priorityItem.count})</span>
                )}
              </span>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppNavigation;