// /src/router/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';
import { routes } from './routes.tsx';
import { ProtectedRoute } from './../ui/ProtectedRoute.tsx'
import { PublicOnlyRoute } from './../ui/PublicOnlyRoute.tsx';
import TaskList from '../components/tasks/TaskList/TaskList.tsx';

const AppRouter = () => {
  return (
    <Routes>
      {routes.map(({ path, component: Component, isProtected, isPublicOnly }) => {
        // Определяем обертку в зависимости от типа роута
        let element;

        if (isPublicOnly) {
          element = (
            <PublicOnlyRoute>
              <Component />
            </PublicOnlyRoute>
          );
        } else if (isProtected) {
          element = (
            <ProtectedRoute>
              <Component />
            </ProtectedRoute>
          );
        } else {
          element = <Component />;
        }

        return (
          <Route
            key={path}
            path={path}
            element={element}
          />
        );
      })}

      {/* 404 роут (обрабатываем отдельно) */}
      <Route path="*" element={
        <ProtectedRoute>
          <TaskList />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRouter;