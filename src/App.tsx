/**
 * КОМПОНЕНТ: App (Главный компонент)
 * Ответственность: корневой компонент, композиция приложения
 * Паттерн: Layout Component / Composition Root
 */
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import TaskList from './components/TaskList.tsx';
import ActiveTasks from './components/pages/ActiveTasks';
import CompletedTasks from './components/pages/CompletedTasks';
import Stats from './components/pages/Stats';

const App = () => {

  return (
    <Router>
      <div className="App">
        <h1>React To-Do</h1>
        {/* 🎯 ПАТТЕРН: Component Composition */}
        {/* Собираем приложение из компонентов как Lego */}

        <nav>
          <Link to="/">All tasks</Link>
          <Link to="/active">Active</Link>
          <Link to="/completed">Completed</Link>
          <Link to="/stats">Stats</Link>
        </nav>

        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/active" element={<ActiveTasks />} />
          <Route path="/completed" element={<CompletedTasks />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
        
      </div>
    </Router>

  );
}

export default App;