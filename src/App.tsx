/**
 * КОМПОНЕНТ: App (Главный компонент)
 * Ответственность: корневой компонент, композиция приложения
 * Паттерн: Layout Component / Composition Root
 */
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import TaskList from './components/TaskList.tsx';
import ActiveTasks from './components/pages/ActiveTasks.tsx';
import CompletedTasks from './components/pages/CompletedTasks.tsx';
import { useTaskStats } from './hooks/useTaskStats.tsx';


const App = () => {
  const {total, active, completed} = useTaskStats()
  return (
   
      <Router>
        <div className="App">
          <h1>React To-Do</h1>
          {/* 🎯 ПАТТЕРН: Component Composition */}
          {/* Собираем приложение из компонентов как Lego */}

          <nav>
            <NavLink className={({ isActive }) => isActive ? 'active-link' : ''} to="/">All tasks({total})</NavLink>
            <NavLink className={({ isActive }) => isActive ? 'active-link' : ''} to="/active">Active({active})</NavLink>
            <NavLink className={({ isActive }) => isActive ? 'active-link' : ''} to="/completed">Completed({completed})</NavLink>
          </nav>

          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/active" element={<ActiveTasks />} />
            <Route path="/completed" element={<CompletedTasks />} />
          </Routes>

        </div>
      </Router>


  );
}

export default App;