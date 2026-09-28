import { useEffect } from 'react';
import { useTodoStore } from '../store/useTodoStore';
import { Task } from '../types/task';
import { PRIORITY_WEIGHTS } from '../constants/priority';

export function useTasks(date?: string) {
  const {
    tasksByDate,
    selectedDate,
    isLoaded,
    loadTasks,
    addTask,
    updateTask,
    toggleTaskCompleted,
    deleteTask,
    reorderTasks,
    moveTaskToDate,
    filterPriority,
    filterStatus,
    filterTag,
    prioritySort,
    setFilterPriority,
    setFilterStatus,
    setFilterTag,
    setPrioritySort,
    togglePrioritySort,
    setSelectedDate,
    getAllTags,
  } = useTodoStore();

  useEffect(() => {
    if (!isLoaded) {
      loadTasks();
    }
  }, [isLoaded, loadTasks]);

  const activeDate = date || selectedDate;
  const rawTasks = tasksByDate[activeDate] || [];

  // Filter tasks
  let filteredTasks = rawTasks.filter((task) => {
    if (filterPriority !== 'all' && task.priority !== filterPriority) {
      return false;
    }
    if (filterStatus === 'pending' && task.completed) {
      return false;
    }
    if (filterStatus === 'completed' && !task.completed) {
      return false;
    }
    if (filterTag && (!task.tags || !task.tags.includes(filterTag))) {
      return false;
    }
    return true;
  });

  // Sort tasks
  if (prioritySort === 'desc') {
    // Urgent first, then high, medium, low
    filteredTasks = [...filteredTasks].sort(
      (a, b) => PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority]
    );
  } else if (prioritySort === 'asc') {
    // Low first, then medium, high, urgent
    filteredTasks = [...filteredTasks].sort(
      (a, b) => PRIORITY_WEIGHTS[a.priority] - PRIORITY_WEIGHTS[b.priority]
    );
  } else {
    // Default drag and drop order
    filteredTasks = [...filteredTasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  // Get available tags on current date tasks or overall
  const availableTags = getAllTags();

  return {
    tasks: filteredTasks,
    allDateTasks: rawTasks,
    selectedDate: activeDate,
    isLoaded,
    filterPriority,
    filterStatus,
    filterTag,
    prioritySort,
    availableTags,
    setSelectedDate,
    setFilterPriority,
    setFilterStatus,
    setFilterTag,
    setPrioritySort,
    togglePrioritySort,
    addTask,
    updateTask,
    toggleTaskCompleted,
    deleteTask,
    reorderTasks: (newTasks: Task[]) => reorderTasks(activeDate, newTasks),
    moveTaskToDate,
  };
}
