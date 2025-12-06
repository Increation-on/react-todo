// components/TaskList.tsx
import { useAuthStore } from "../../../store/AuthStore.tsx";
import { useTaskStore } from "../../../store/TaskStore.tsx";
import { useTasksAPI } from "../../../hooks/api/useTasksAPI.tsx";
import {useTaskOperations} from '../../../hooks/tasks/useTaskOperations.tsx'
import { useTaskSearch } from "../../../hooks/tasks/useTaskSearch.tsx";
import { useTaskNotifications } from "../../../hooks/ui/useTaskNotification.tsx";

import TaskListHeader from "./TaskListHeader.tsx";
import TaskListView from "./TaskListView.tsx";
import AddTask from "../AddTask.tsx";
import Search from './../../../ui/Search.tsx'
import './../../../styles/TaskList.css'

const TaskList: React.FC = () => {
  // Базовые данные
  const userId = useAuthStore(state => state.getUserId());
  const getUserTasks = useTaskStore(state => state.getUserTasks);
  const tasks = getUserTasks(userId);
  const addTask = useTaskStore(state => state.addTask);

  // Хуки для операций
  const taskNotify = useTaskNotifications();
  const { handleToggle, handleDelete } = useTaskOperations();
  const search = useTaskSearch(tasks);
  
  // API загрузка
  const { loadTasksFromAPI, isLoading } = useTasksAPI(tasks);

  // Обработчики
  const handleLoadFromAPI = async (): Promise<void> => {
    try {
      const tasksToAdd = await loadTasksFromAPI();
      
      if (tasksToAdd.length > 0) {
        taskNotify.api.loadSuccess(tasksToAdd.length);
        tasksToAdd.forEach(task => addTask(task.text));
      } else {
        taskNotify.api.noData();
      }
      
      search.setSelectedTaskId(null);
      search.setShowAutocomplete(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки';
      taskNotify.api.loadError(errorMessage);
    }
  };

  const handleAddTask = (text: string): void => {
    addTask(text);
    search.setSelectedTaskId(null);
    search.setShowAutocomplete(false);
  };

  const handleDeleteWithSearch = (taskId: string | number): void => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    handleDelete(task, {
      onSuccess: () => {
        if (taskId === search.selectedTaskId) {
          search.clearSearch();
        }
      },
      selectedTaskId: search.selectedTaskId
    });
    
    search.setSelectedTaskId(null);
  };

  return (
    <div className="task-list-container">
      <TaskListHeader 
        isLoading={isLoading}
        onLoadFromAPI={handleLoadFromAPI}
      />
      
      <AddTask onAddTask={handleAddTask} />

      <Search 
        value={search.query}
        onChange={search.handleInputChange}
        results={search.searchResults}
        onSelect={search.handleTaskSelect}
        onClear={search.handleClearSearch}
        onKeyDown={search.handleKeyDown}
        onFocus={search.handleFocus}
        showAutocomplete={search.showAutocomplete}
        isLoading={search.isSearching}
        placeholder="🔍 Search tasks..."
      />

      <TaskListView 
        tasks={search.tasksToShow}
        onToggle={(id) => {
          const task = tasks.find(t => t.id === id);
          if (task) handleToggle(task);
        }}
        onDelete={handleDeleteWithSearch}
        isEmpty={search.tasksToShow.length === 0}
      />
    </div>
  );
};

export default TaskList;