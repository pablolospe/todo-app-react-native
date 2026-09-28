import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTodoStore } from '../../store/useTodoStore';
import { CalendarView } from '../../components/CalendarView';
import { TaskCard } from '../../components/TaskCard';
import { TaskActionModal } from '../../components/TaskActionModal';
import { AddTaskFAB } from '../../components/AddTaskFAB';
import { Task } from '../../types/task';
import { formatDisplayDate, getTomorrowString } from '../../utils/dateHelpers';

export default function CalendarScreen() {
  const router = useRouter();
  const {
    tasksByDate,
    selectedDate,
    setSelectedDate,
    toggleTaskCompleted,
    deleteTask,
    moveTaskToDate,
  } = useTodoStore();

  const [activeTaskForModal, setActiveTaskForModal] = useState<Task | null>(null);

  const tasksForSelectedDay = tasksByDate[selectedDate] || [];

  const handleEditTask = (task: Task) => {
    router.push({
      pathname: '/task/[id]',
      params: { id: task.id },
    });
  };

  const handleCreateTask = () => {
    router.push({
      pathname: '/task/[id]',
      params: { id: 'new', initialDate: selectedDate },
    });
  };

  const handleMoveToTomorrow = async (task: Task) => {
    const tomorrowStr = getTomorrowString();
    await moveTaskToDate(task.id, task.date, tomorrowStr);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Calendar Picker */}
        <CalendarView
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          tasksByDate={tasksByDate}
        />

        {/* Selected Day Header */}
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>
            Tareas para {formatDisplayDate(selectedDate)}
          </Text>
          <Text style={styles.dayCount}>
            {tasksForSelectedDay.length} {tasksForSelectedDay.length === 1 ? 'tarea' : 'tareas'}
          </Text>
        </View>

        {/* Task list for selected date */}
        {tasksForSelectedDay.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-clear-outline" size={48} color="#8E8E93" />
            <Text style={styles.emptyTitle}>Sin tareas para este día</Text>
            <Text style={styles.emptySubtitle}>
              Toca el botón '+' flotante para planificar una tarea para esta fecha.
            </Text>
          </View>
        ) : (
          tasksForSelectedDay.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() => toggleTaskCompleted(task.id, selectedDate)}
              onPress={() => handleEditTask(task)}
              onLongPress={() => setActiveTaskForModal(task)}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Add Task Button */}
      <AddTaskFAB onPress={handleCreateTask} />

      {/* Task Action Modal */}
      <TaskActionModal
        task={activeTaskForModal}
        visible={!!activeTaskForModal}
        onClose={() => setActiveTaskForModal(null)}
        onEdit={() => {
          if (activeTaskForModal) handleEditTask(activeTaskForModal);
        }}
        onMoveToTomorrow={() => {
          if (activeTaskForModal) handleMoveToTomorrow(activeTaskForModal);
        }}
        onDelete={() => {
          if (activeTaskForModal) deleteTask(activeTaskForModal.id, selectedDate);
        }}
        onMoveToDate={(targetDate) => {
          if (activeTaskForModal) {
            moveTaskToDate(activeTaskForModal.id, activeTaskForModal.date, targetDate);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  dayCount: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
