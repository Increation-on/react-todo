/**
 * КОМПОНЕНТ: App (Главный компонент)
 * Ответственность: корневой компонент, композиция приложения
 * Паттерн: Layout Component / Composition Root
 */

import './App.css';
import TaskList from './components/TaskList';

function App() {
  return (
    <div className="App">
      <h1>React To-Do</h1>
      {/* 🎯 ПАТТЕРН: Component Composition */}
      {/* Собираем приложение из компонентов как Lego */}
      <TaskList />
    </div>
  );
}

export default App;