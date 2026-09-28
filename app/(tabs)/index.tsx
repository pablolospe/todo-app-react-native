import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Pressable,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types/task';
import { DraggableList } from '../../components/DraggableList';
import { AddTaskFAB } from '../../components/AddTaskFAB';
import { QuickFilters } from '../../components/QuickFilters';
import { TaskActionModal } from '../../components/TaskActionModal';
import { formatDisplayDate, getTomorrowString, getTodayString } from '../../utils/dateHelpers';

export default function TodayScreen() {
  const router = useRouter();
  const {
    tasks,
    allDateTasks,
    selectedDate,
    setSelectedDate,
    toggleTaskCompleted,
    deleteTask,
    reorderTasks,
    moveTaskToDate,
    filterPriority,
    filterStatus,
    setFilterPriority,
    setFilterStatus,
  } = useTasks();

  const [activeTaskForModal, setActiveTaskForModal] = useState<Task | null>(null);

  const completedCount = allDateTasks.filter((t) => t.completed).length;
  const totalCount = allDateTasks.length;

  const handleCreateTask = () => {
    router.push({
      pathname: '/task/[id]',
      params: { id: 'new', initialDate: selectedDate },
    });
  };

  const handleEditTask = (task: Task) => {
    router.push({
      pathname: '/task/[id]',
      params: { id: task.id },
    });
  };

  const handleMoveToTomorrow = async (task: Task) => {
    const tomorrowStr = getTomorrowString();
    await moveTaskToDate(task.id, task.date, tomorrowStr);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Date Header Switcher */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dateTitle}>{formatDisplayDate(selectedDate)}</Text>
          <Text style={styles.dateSubtitle}>{selectedDate}</Text>
        </View>

        {selectedDate !== getTodayString() && (
          <Pressable
            style={styles.todayButton}
            onPress={() => setSelectedDate(getTodayString())}>
            <Text style={styles.todayButtonText}>Ir a Hoy</Text>
          </Pressable>
        )}
      </View>

      {/* Progress Card */}
      {totalCount > 0 && (
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progreso diario</Text>
            <Text style={styles.progressCount}>
              {completedCount} / {totalCount} ({Math.round((completedCount / totalCount) * 100)}%)
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(completedCount / totalCount) * 100}%` },
              ]}
            />
          </View>
        </View>
      )}

      {/* Quick Filters */}
      <QuickFilters
        selectedPriority={filterPriority}
        onSelectPriority={setFilterPriority}
        selectedStatus={filterStatus}
        onSelectStatus={setFilterStatus}
      />

      {/* List / Empty State */}
      <View style={styles.listContainer}>
        <DraggableList
          tasks={tasks}
          onToggleTask={(id) => toggleTaskCompleted(id, selectedDate)}
          onPressTask={handleEditTask}
          onLongPressTask={(task) => setActiveTaskForModal(task)}
          onDragEnd={reorderTasks}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="sparkles-outline" size={56} color="#007AFF" />
              <Text style={styles.emptyTitle}>¡Todo listo por hoy!</Text>
              <Text style={styles.emptySubtitle}>
                {totalCount === 0
                  ? 'No hay tareas asignadas para este día.'
                  : 'No hay tareas que coincidan con los filtros seleccionados.'}
              </Text>
              {totalCount === 0 && (
                <Pressable style={styles.emptyButton} onPress={handleCreateTask}>
                  <Text style={styles.emptyButtonText}>Crear primera tarea</Text>
                </Pressable>
              )}
            </View>
          }
        />
      </View>

      {/* Floating Action Button */}
      <AddTaskFAB onPress={handleCreateTask} />

      {/* Long Press Action Modal */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: 8,
  },
  dateTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  dateSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 2,
  },
  todayButton: {
    backgroundColor: '#007AFF15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  todayButtonText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 8,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  progressCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 4,
  },
  listContainer: {
    flex: 1,
    marginTop: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 8,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
