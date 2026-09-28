export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export const PRIORITY_COLORS: Record<Priority, string> = {
  urgent: '#FF3B30', // Rojo
  high: '#FF9500',   // Naranja
  medium: '#FFCC00', // Amarillo
  low: '#34C759',    // Verde
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  urgent: 'Urgente',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

export const PRIORITY_ICONS: Record<Priority, string> = {
  urgent: '⚡',
  high: '🔥',
  medium: '📌',
  low: '💤',
};

export const PRIORITIES: Priority[] = ['urgent', 'high', 'medium', 'low'];

// Numeric weight for sorting: higher number = higher priority
export const PRIORITY_WEIGHTS: Record<Priority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};
