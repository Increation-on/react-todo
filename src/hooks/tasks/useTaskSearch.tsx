// hooks/useTaskSearch.ts
import { useState, useCallback, useEffect } from 'react';
import { useSearch } from '../ui/useSearch.tsx';
import { BaseTask } from '../../types/task.types.ts';

export const useTaskSearch = (tasks: BaseTask[]) => {
  const {
    query,
    setQuery,
    results: searchResults,
    isLoading: isSearching,
    clearSearch
  } = useSearch({
    items: tasks,
    searchFn: (task, query) => 
      task.text.toLowerCase().includes(query.toLowerCase()),
    debounceMs: 300
  });

  const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(null);
  const [showAutocomplete, setShowAutocomplete] = useState(true);

  const selectedTask = selectedTaskId 
    ? tasks.find(t => t.id === selectedTaskId) 
    : null;

  const tasksToShow = selectedTask ? [selectedTask] : tasks;

  // Преобразуем для TaskListView
  const tasksForView = tasksToShow.map(task => ({
    id: task.id,
    text: task.text,
    completed: task.completed
  }));

  const handleInputChange = useCallback((value: string): void => {
    setQuery(value);
    if (value.trim()) {
      setShowAutocomplete(true);
    }
  }, [setQuery]);

  const handleTaskSelect = useCallback((task: BaseTask): void => {
    setQuery(task.text);
    setSelectedTaskId(task.id);
    setShowAutocomplete(false);
  }, [setQuery]);

  const handleClearSearch = useCallback((): void => {
    clearSearch();
    setSelectedTaskId(null);
    setShowAutocomplete(false);
  }, [clearSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      setShowAutocomplete(false);
      if (searchResults.length > 0) {
        handleTaskSelect(searchResults[0]);
      }
    }
    if (e.key === 'Escape') {
      setShowAutocomplete(false);
    }
  }, [searchResults, handleTaskSelect]);

  const handleFocus = useCallback((): void => {
    if (searchResults.length > 0 && query.trim()) {
      setShowAutocomplete(true);
    }
  }, [searchResults, query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.search-section')) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return {
    query,
    searchResults,
    isSearching,
    tasksToShow: tasksForView, // Используем преобразованные задачи
    showAutocomplete,
    selectedTaskId,
    handleInputChange,
    handleTaskSelect,
    handleClearSearch,
    handleKeyDown,
    handleFocus,
    clearSearch,
    setSelectedTaskId,
    setShowAutocomplete
  };
};