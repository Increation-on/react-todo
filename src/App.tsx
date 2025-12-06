import { useAuthStore } from './store/AuthStore.tsx';
import AppRouter from './components/router/AppRouter.tsx';
import MainLayout from './components/layout/MainLayout.tsx';
import { useTokenWatch } from './hooks/useTokenWatch.tsx'
import { BrowserRouter as Router } from 'react-router-dom';
import './components/styles/App.css'

const App = () => {
  // Слежение за токеном
  useTokenWatch();

  const token = useAuthStore((state) => state.token);

  console.log('🏠 App render. Auth:', !!token);

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