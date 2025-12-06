// /src/router/routes.ts
import LoginPage from '../pages/LoginPage.tsx';
import RegisterPage from '../pages/RegisterPage.tsx';
import TaskList from './../components/tasks/TaskList/TaskList.tsx';
import ActiveTasks from '../pages/ActiveTasks.tsx';
import CompletedTasks from '../pages/CompletedTasks.tsx';

export interface RouteItem {
  path: string;
  component: React.ComponentType;
  isProtected?: boolean;
  isPublicOnly?: boolean;
  label?: string;
}

export const routes: RouteItem[] = [
  // 📍 ПУБЛИЧНЫЕ МАРШРУТЫ
  {
    path: '/login',
    component: LoginPage,
    isPublicOnly: true,
    label: 'Login'
  },
  {
    path: '/register',
    component: RegisterPage,
    isPublicOnly: true,
    label: 'Register'
  },
  
  // 🔐 ПРИВАТНЫЕ МАРШРУТЫ
  {
    path: '/',
    component: TaskList,
    isProtected: true,
    label: 'All Tasks'
  },
  {
    path: '/active',
    component: ActiveTasks,
    isProtected: true,
    label: 'Active'
  },
  {
    path: '/completed',
    component: CompletedTasks,
    isProtected: true,
    label: 'Completed'
  }
];

// Вспомогательные функции
export const getNavigationRoutes = (): RouteItem[] => 
  routes.filter(route => route.label && route.isProtected);