import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Task } from '../types/task';
import { PRIORITY_COLORS } from '../constants/priority';
import { PriorityBadge } from './PriorityBadge';
import { TagPill } from './TagPill';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onPress: () => void;
  onLongPress?: () => void;
  drag?: () => void;
  isActive?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onPress,
  onLongPress,
  drag,
  isActive,
}) => {
  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;

  const handleToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onToggle();
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={() => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        if (onLongPress) {
          onLongPress();
        }
      }}
      delayLongPress={250}
      style={({ pressed }) => [
        styles.card,
        isActive && styles.cardActive,
        pressed && styles.cardPressed,
      ]}>
      {/* Priority Indicator Line */}
      <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />

      {/* Drag handle button if draggable */}
      {drag && (
        <Pressable
          onPressIn={drag}
          hitSlop={10}
          style={styles.dragHandle}>
          <Ionicons name="reorder-two" size={22} color="#8E8E93" />
        </Pressable>
      )}

      {/* Checkbox */}
      <Pressable onPress={handleToggle} hitSlop={10} style={styles.checkboxContainer}>
        <View
          style={[
            styles.checkbox,
            task.completed && styles.checkboxCompleted,
            task.completed && { backgroundColor: priorityColor, borderColor: priorityColor },
          ]}>
          {task.completed && <Ionicons name="checkmark" size={16} color="#FFF" />}
        </View>
      </Pressable>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text
            style={[styles.title, task.completed && styles.titleCompleted]}
            numberOfLines={2}>
            {task.title}
          </Text>
        </View>

        {!!task.description && (
          <Text
            style={[styles.description, task.completed && styles.descriptionCompleted]}
            numberOfLines={2}>
            {task.description}
          </Text>
        )}

        <View style={styles.footerRow}>
          <PriorityBadge priority={task.priority} />
          <View style={styles.tagsContainer}>
            {task.tags.map((tag, idx) => (
              <TagPill key={`${tag}-${idx}`} label={tag} />
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  cardActive: {
    backgroundColor: '#F9F9FB',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  cardPressed: {
    opacity: 0.95,
  },
  priorityIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  dragHandle: {
    paddingRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    borderWidth: 0,
  },
  content: {
    flex: 1,
    paddingLeft: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  description: {
    fontSize: 13,
    color: '#636366',
    marginTop: 4,
    lineHeight: 18,
  },
  descriptionCompleted: {
    textDecorationLine: 'line-through',
    color: '#AEAEB2',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
