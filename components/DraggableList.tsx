import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';

interface DraggableListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onPressTask: (task: Task) => void;
  onLongPressTask?: (task: Task) => void;
  onDragEnd: (data: Task[]) => void;
  ListEmptyComponent?: React.ReactElement;
  ListHeaderComponent?: React.ReactElement;
}

export const DraggableList: React.FC<DraggableListProps> = ({
  tasks,
  onToggleTask,
  onPressTask,
  onLongPressTask,
  onDragEnd,
  ListEmptyComponent,
  ListHeaderComponent,
}) => {
  // If on Web, provide standard FlatList with fallbacks if needed, or DraggableFlatList
  const renderItem = ({ item, drag, isActive }: RenderItemParams<Task>) => {
    return (
      <ScaleDecorator>
        <TaskCard
          task={item}
          isActive={isActive}
          drag={drag}
          onToggle={() => onToggleTask(item.id)}
          onPress={() => onPressTask(item)}
          onLongPress={onLongPressTask ? () => onLongPressTask(item) : undefined}
        />
      </ScaleDecorator>
    );
  };

  if (Platform.OS === 'web') {
    return (
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={() => onToggleTask(item.id)}
            onPress={() => onPressTask(item)}
            onLongPress={onLongPressTask ? () => onLongPressTask(item) : undefined}
          />
        )}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.listContent}
      />
    );
  }

  return (
    <DraggableFlatList
      data={tasks}
      onDragEnd={({ data }) => onDragEnd(data)}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 90,
    flexGrow: 1,
  },
});
