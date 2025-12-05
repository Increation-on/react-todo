// /src/hooks/useAppNavigation.ts
import { useTaskStats } from './../hooks/useTaskStats.tsx'
import { getNavigationRoutes } from '../components/router/routes.tsx';

export interface NavigationItem {
  path: string;
  label: string;
  count?: number;
}

export const useAppNavigation = (): NavigationItem[] => {
  const { total, active, completed } = useTaskStats();
  const navRoutes = getNavigationRoutes();
  
  return navRoutes.map(route => {
    let count: number | undefined;
    
    switch(route.path) {
      case '/':
        count = total;
        break;
      case '/active':
        count = active;
        break;
      case '/completed':
        count = completed;
        break;
      default:
        count = undefined;
    }
    
    return {
      path: route.path,
      label: route.label || '',
      count
    };
  });
};