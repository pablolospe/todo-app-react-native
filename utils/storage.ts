import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskStoreMap } from '../types/task';

const TASKS_STORAGE_KEY = '@todo_app_tasks_v1';

export const storage = {
  async getTasks(): Promise<TaskStoreMap> {
    try {
      const json = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      return json ? JSON.parse(json) : {};
    } catch (e) {
      console.error('Error reading tasks from storage:', e);
      return {};
    }
  },

  async saveTasks(tasksMap: TaskStoreMap): Promise<void> {
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksMap));
    } catch (e) {
      console.error('Error saving tasks to storage:', e);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TASKS_STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing tasks from storage:', e);
    }
  },
};
