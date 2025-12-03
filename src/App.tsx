// /src/App.tsx
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import TaskList from './components/TaskList.tsx';
import ActiveTasks from './components/pages/ActiveTasks.tsx';
import CompletedTasks from './components/pages/CompletedTasks.tsx';
import { useTaskStats } from './hooks/useTaskStats.tsx';
import { useAuthStore } from './store/AuthStore.tsx';
import LoginPage from './components/pages/LoginPage.tsx';
import { LogoutButton } from './components/LogoutButton.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { PublicOnlyRoute } from './components/PublicOnlyRoute.tsx';
import RegisterPage from './components/pages/RegisterPage.tsx';
import AuthNotification from './components/notifications/AuthNotification/AuthNotification.tsx';
import EditModal from './components/EditModal.tsx';

const App = () => {

 // В App.tsx компоненте:
 const token = useAuthStore((state) => state.token);
useEffect(() => {
  if (token) {
    console.log('🔐 Есть токен, запускаем слежение');
    const cleanup = useAuthStore.getState().startTokenWatch();
    return cleanup;
  }
}, [token]);

  const { total, active, completed } = useTaskStats();
 

  console.log('🏠 App render. Auth:', !!token);

  return (
    <Router>
      <div className="App">
        <AuthNotification />
        
        <EditModal/>
        {/* ШАПКА С ВЫХОДОМ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>React To-Do</h1>
          {token && <LogoutButton />}
        </div>

        {/* НАВИГАЦИЯ ПО ЗАДАЧАМ (только для авторизованных) */}
        {token && (
          <nav>
            <NavLink
              className={({ isActive }) => isActive ? 'active-link' : ''}
              to="/"
            >
              All tasks({total})
            </NavLink>
            <NavLink
              className={({ isActive }) => isActive ? 'active-link' : ''}
              to="/active"
            >
              Active({active})
            </NavLink>
            <NavLink
              className={({ isActive }) => isActive ? 'active-link' : ''}
              to="/completed"
            >
              Completed({completed})
            </NavLink>
          </nav>
        )}

        {/* МАРШРУТЫ */}
        <Routes>
          {/* 📍 ПУБЛИЧНЫЕ МАРШРУТЫ */}
          <Route path="/login" element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          } />

          <Route path="/register" element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          } />

          {/* 🔐 ПРИВАТНЫЕ МАРШРУТЫ */}
          <Route path="/" element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          } />

          <Route path="/active" element={
            <ProtectedRoute>
              <ActiveTasks />
            </ProtectedRoute>
          } />

          <Route path="/completed" element={
            <ProtectedRoute>
              <CompletedTasks />
            </ProtectedRoute>
          } />

          {/* 🎯 ОБРАБОТКА НЕИЗВЕСТНЫХ ПУТЕЙ */}
          <Route path="*" element={
            <ProtectedRoute>
              {/* Можно создать NotFoundPage, но пока редирект */}
              <Navigate to="/" replace />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;