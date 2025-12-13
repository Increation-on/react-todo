// components/TaskList.tsx
import { useTaskStore } from "../../../store/TaskStore.tsx";
import { useTasksAPI } from "../../../hooks/api/useTasksAPI.tsx";
import {useTaskOperations} from '../../../hooks/tasks/useTaskOperations.tsx'
import { useTaskSearch } from "../../../hooks/tasks/useTaskSearch.tsx";
import { useTaskNotifications } from "../../../hooks/ui/useTaskNotification.tsx";
import TaskListHeader from "./TaskListHeader.tsx";
import TaskListView from "./TaskListView.tsx";
import AddTask from "../AddTask.tsx";
import Search from './../../../ui/Search.tsx'
import { usePriorityTasks } from '../../../hooks/tasks/usePriorityTasks.tsx';
import './../../../styles/TaskList.css'

const TaskList: React.FC = () => {
  const addTask = useTaskStore(state => state.addTask);
  const { sortedTasks, isLoadingPriorirty } = usePriorityTasks();
  
  // Хуки для операций
  const taskNotify = useTaskNotifications();
  const { handleToggle, handleDelete } = useTaskOperations();
  
  // 🔥 ПЕРЕДАЕМ sortedTasks
  const search = useTaskSearch(sortedTasks);
  const { loadTasksFromAPI, isLoading } = useTasksAPI(sortedTasks);

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
    const task = sortedTasks.find(t => t.id === taskId); // <-- Используем sortedTasks
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
        isLoading={isLoading || isLoadingPriorirty} // <-- Добавляем isLoadingPriority
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
          const task = sortedTasks.find(t => t.id === id); // <-- Используем sortedTasks
          if (task) handleToggle(task);
        }}
        onDelete={handleDeleteWithSearch}
        isEmpty={search.tasksToShow.length === 0}
      />
    </div>
  );
};

export default TaskList;