import { useAuthStore } from './store/AuthStore.tsx';
import AppRouter from './router/AppRouter.tsx';
import MainLayout from './components/layout/MainLayout.tsx';
import { useTokenWatch } from './hooks/auth/useTokenWatch.tsx';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/App.css'

const App = () => {
  // Слежение за токеном
  useTokenWatch();

  const token = useAuthStore((state) => state.token);

  return (
    <Router>
      <div className="app-wrapper">
        <MainLayout showNavigation={!!token}>
          <AppRouter />
        </MainLayout>
      </div>
    </Router>

  );
};

export default App;