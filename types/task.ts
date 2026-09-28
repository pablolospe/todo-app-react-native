import { Priority } from '../constants/priority';

export interface Task {
  id: string;           // UUID or timestamp-based ID
  title: string;
  description?: string;
  tags: string[];
  priority: Priority;
  date: string;         // 'YYYY-MM-DD'
  order: number;        // Para ordenamiento
  completed: boolean;
  createdAt: string;    // ISO timestamp
}

export type TaskStoreMap = {
  [date: string]: Task[];
};
