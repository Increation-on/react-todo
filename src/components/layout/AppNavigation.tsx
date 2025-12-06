import { NavLink } from 'react-router-dom';
import { useAppNavigation } from '../../hooks/ui/useAppNavigation.tsx';
import './../../styles/AppNavigation.css'

const AppNavigation = () => {
  const navigationItems = useAppNavigation();
  
  if (navigationItems.length === 0) {
    return null; // Не показываем навигацию если нет элементов
  }
  
  return (
    <nav className="app-navigation">
      {navigationItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active-link' : ''}`
          }
          end={item.path === '/'}
        >
          <span className="nav-link-text">
            {item.label}
          </span>
          {item.count !== undefined && (
            <span className="nav-link-count">
              ({item.count})
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default AppNavigation;