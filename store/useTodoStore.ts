import { create } from 'zustand';
import { Task, TaskStoreMap } from '../types/task';
import { Priority, PRIORITY_WEIGHTS } from '../constants/priority';
import { storage } from '../utils/storage';
import { getTodayString } from '../utils/dateHelpers';

export type PrioritySortOrder = 'none' | 'desc' | 'asc';

interface TodoState {
  tasksByDate: TaskStoreMap;
  selectedDate: string;
  isLoaded: boolean;
  filterPriority: Priority | 'all';
  filterStatus: 'all' | 'pending' | 'completed';
  filterTag: string | null;
  prioritySort: PrioritySortOrder;

  // Actions
  loadTasks: () => Promise<void>;
  setSelectedDate: (date: string) => void;
  setFilterPriority: (priority: Priority | 'all') => void;
  setFilterStatus: (status: 'all' | 'pending' | 'completed') => void;
  setFilterTag: (tag: string | null) => void;
  setPrioritySort: (sort: PrioritySortOrder) => void;
  togglePrioritySort: () => void;
  
  addTask: (taskData: Omit<Task, 'id' | 'order' | 'completed' | 'createdAt'>) => Promise<Task>;
  updateTask: (taskId: string, date: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  toggleTaskCompleted: (taskId: string, date: string) => Promise<void>;
  deleteTask: (taskId: string, date: string) => Promise<void>;
  reorderTasks: (date: string, newTasks: Task[]) => Promise<void>;
  moveTaskToDate: (taskId: string, fromDate: string, toDate: string) => Promise<void>;
  getTaskById: (taskId: string) => { task: Task; date: string } | null;
  getAllTags: () => string[];
}

export const useTodoStore = create<TodoState>((set, get) => ({
  tasksByDate: {},
  selectedDate: getTodayString(),
  isLoaded: false,
  filterPriority: 'all',
  filterStatus: 'all',
  filterTag: null,
  prioritySort: 'none',

  setSelectedDate: (date: string) => set({ selectedDate: date }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterTag: (tag) => set({ filterTag: tag }),
  setPrioritySort: (sort) => set({ prioritySort: sort }),

  togglePrioritySort: () => {
    const { prioritySort } = get();
    // Cycle: none (drag & drop) -> desc (urgente primero) -> asc (baja primero) -> none
    let nextSort: PrioritySortOrder = 'none';
    if (prioritySort === 'none') {
      nextSort = 'desc';
    } else if (prioritySort === 'desc') {
      nextSort = 'asc';
    } else {
      nextSort = 'none';
    }
    set({ prioritySort: nextSort });
  },

  getAllTags: () => {
    const { tasksByDate } = get();
    const tagSet = new Set<string>();
    Object.values(tasksByDate).forEach((list) => {
      list.forEach((t) => {
        if (t.tags && Array.isArray(t.tags)) {
          t.tags.forEach((tag) => {
            if (tag.trim()) tagSet.add(tag.trim());
          });
        }
      });
    });
    return Array.from(tagSet).sort();
  },

  loadTasks: async () => {
    const tasks = await storage.getTasks();
    set({ tasksByDate: tasks, isLoaded: true });
  },

  addTask: async (taskData) => {
    const { tasksByDate } = get();
    const date = taskData.date || getTodayString();
    const currentList = tasksByDate[date] || [];

    const newTask: Task = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
      title: taskData.title.trim(),
      description: taskData.description?.trim(),
      tags: taskData.tags || [],
      priority: taskData.priority || 'medium',
      date,
      order: currentList.length,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedDateList = [...currentList, newTask];
    const newTasksByDate = {
      ...tasksByDate,
      [date]: updatedDateList,
    };

    set({ tasksByDate: newTasksByDate });
    await storage.saveTasks(newTasksByDate);
    return newTask;
  },

  updateTask: async (taskId, date, updates) => {
    const { tasksByDate } = get();
    const currentList = tasksByDate[date] || [];

    // If date changed as part of update
    if (updates.date && updates.date !== date) {
      const task = currentList.find((t) => t.id === taskId);
      if (!task) return;
      const updatedTask = { ...task, ...updates };

      const oldList = currentList.filter((t) => t.id !== taskId);
      const targetDateList = [...(tasksByDate[updates.date] || []), updatedTask].map((t, idx) => ({
        ...t,
        order: idx,
      }));

      const newTasksByDate = {
        ...tasksByDate,
        [date]: oldList,
        [updates.date]: targetDateList,
      };

      set({ tasksByDate: newTasksByDate });
      await storage.saveTasks(newTasksByDate);
      return;
    }

    const updatedDateList = currentList.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
    const newTasksByDate = {
      ...tasksByDate,
      [date]: updatedDateList,
    };

    set({ tasksByDate: newTasksByDate });
    await storage.saveTasks(newTasksByDate);
  },

  toggleTaskCompleted: async (taskId, date) => {
    const { tasksByDate } = get();
    const currentList = tasksByDate[date] || [];
    const updatedDateList = currentList.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    const newTasksByDate = {
      ...tasksByDate,
      [date]: updatedDateList,
    };

    set({ tasksByDate: newTasksByDate });
    await storage.saveTasks(newTasksByDate);
  },

  deleteTask: async (taskId, date) => {
    const { tasksByDate } = get();
    const currentList = tasksByDate[date] || [];
    const updatedDateList = currentList.filter((t) => t.id !== taskId).map((t, idx) => ({
      ...t,
      order: idx,
    }));

    const newTasksByDate = {
      ...tasksByDate,
      [date]: updatedDateList,
    };

    set({ tasksByDate: newTasksByDate });
    await storage.saveTasks(newTasksByDate);
  },

  reorderTasks: async (date, newTasks) => {
    const { tasksByDate } = get();
    const indexedTasks = newTasks.map((t, idx) => ({ ...t, order: idx }));
    const newTasksByDate = {
      ...tasksByDate,
      [date]: indexedTasks,
    };

    set({ tasksByDate: newTasksByDate });
    await storage.saveTasks(newTasksByDate);
  },

  moveTaskToDate: async (taskId, fromDate, toDate) => {
    if (fromDate === toDate) return;
    const { tasksByDate } = get();
    const fromList = tasksByDate[fromDate] || [];
    const task = fromList.find((t) => t.id === taskId);
    if (!task) return;

    const updatedFromList = fromList.filter((t) => t.id !== taskId).map((t, idx) => ({
      ...t,
      order: idx,
    }));

    const toList = tasksByDate[toDate] || [];
    const movedTask: Task = {
      ...task,
      date: toDate,
      order: toList.length,
    };
    const updatedToList = [...toList, movedTask];

    const newTasksByDate = {
      ...tasksByDate,
      [fromDate]: updatedFromList,
      [toDate]: updatedToList,
    };

    set({ tasksByDate: newTasksByDate });
    await storage.saveTasks(newTasksByDate);
  },

  getTaskById: (taskId: string) => {
    const { tasksByDate } = get();
    for (const [date, list] of Object.entries(tasksByDate)) {
      const found = list.find((t) => t.id === taskId);
      if (found) {
        return { task: found, date };
      }
    }
    return null;
  },
}));
