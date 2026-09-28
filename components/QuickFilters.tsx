import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Priority, PRIORITIES, PRIORITY_COLORS, PRIORITY_LABELS, PRIORITY_ICONS } from '../constants/priority';

interface QuickFiltersProps {
  selectedPriority: Priority | 'all';
  onSelectPriority: (priority: Priority | 'all') => void;
  selectedStatus: 'all' | 'pending' | 'completed';
  onSelectStatus: (status: 'all' | 'pending' | 'completed') => void;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  selectedPriority,
  onSelectPriority,
  selectedStatus,
  onSelectStatus,
}) => {
  const handlePressPriority = (p: Priority | 'all') => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onSelectPriority(p);
  };

  const handlePressStatus = (s: 'all' | 'pending' | 'completed') => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onSelectStatus(s);
  };

  return (
    <View style={styles.wrapper}>
      {/* Status pills */}
      <View style={styles.statusRow}>
        <Pressable
          onPress={() => handlePressStatus('all')}
          style={[styles.statusChip, selectedStatus === 'all' && styles.statusChipActive]}>
          <Text
            style={[
              styles.statusText,
              selectedStatus === 'all' && styles.statusTextActive,
            ]}>
            Todas
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handlePressStatus('pending')}
          style={[styles.statusChip, selectedStatus === 'pending' && styles.statusChipActive]}>
          <Text
            style={[
              styles.statusText,
              selectedStatus === 'pending' && styles.statusTextActive,
            ]}>
            Pendientes
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handlePressStatus('completed')}
          style={[styles.statusChip, selectedStatus === 'completed' && styles.statusChipActive]}>
          <Text
            style={[
              styles.statusText,
              selectedStatus === 'completed' && styles.statusTextActive,
            ]}>
            Completadas
          </Text>
        </Pressable>
      </View>

      {/* Priority pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.priorityScroll}>
        <Pressable
          onPress={() => handlePressPriority('all')}
          style={[
            styles.priorityChip,
            selectedPriority === 'all' && styles.priorityChipAllActive,
          ]}>
          <Text
            style={[
              styles.priorityText,
              selectedPriority === 'all' && styles.priorityTextActive,
            ]}>
            Cualquier prioridad
          </Text>
        </Pressable>

        {PRIORITIES.map((p) => {
          const isSelected = selectedPriority === p;
          const color = PRIORITY_COLORS[p];
          return (
            <Pressable
              key={p}
              onPress={() => handlePressPriority(p)}
              style={[
                styles.priorityChip,
                isSelected && {
                  backgroundColor: `${color}25`,
                  borderColor: color,
                },
              ]}>
              <Text style={styles.priorityIcon}>{PRIORITY_ICONS[p]}</Text>
              <Text
                style={[
                  styles.priorityText,
                  isSelected && { color, fontWeight: '700' },
                ]}>
                {PRIORITY_LABELS[p]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
  },
  statusChipActive: {
    backgroundColor: '#007AFF',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  statusTextActive: {
    color: '#FFFFFF',
  },
  priorityScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: 4,
  },
  priorityChipAllActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF15',
  },
  priorityIcon: {
    fontSize: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#636366',
  },
  priorityTextActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
});
