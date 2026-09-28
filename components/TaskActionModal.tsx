import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types/task';
import { getTomorrowString, formatDisplayDate } from '../utils/dateHelpers';

interface TaskActionModalProps {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onMoveToTomorrow: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onMoveToDate: (targetDate: string) => void;
}

export const TaskActionModal: React.FC<TaskActionModalProps> = ({
  task,
  visible,
  onClose,
  onMoveToTomorrow,
  onDelete,
  onEdit,
  onMoveToDate,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (!task) return null;

  const tomorrowStr = getTomorrowString();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.dragIndicator} />

              <Text style={styles.title} numberOfLines={1}>
                {task.title}
              </Text>
              <Text style={styles.subtitle}>
                Fecha actual: {formatDisplayDate(task.date)} ({task.date})
              </Text>

              <View style={styles.menuOptions}>
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onEdit();
                    onClose();
                  }}>
                  <Ionicons name="create-outline" size={22} color="#007AFF" />
                  <Text style={styles.optionText}>Editar tarea</Text>
                </Pressable>

                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onMoveToTomorrow();
                    onClose();
                  }}>
                  <Ionicons name="calendar-outline" size={22} color="#FF9500" />
                  <Text style={styles.optionText}>Mover a mañana ({tomorrowStr})</Text>
                </Pressable>

                <Pressable
                  style={[styles.option, styles.deleteOption]}
                  onPress={() => {
                    onDelete();
                    onClose();
                  }}>
                  <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                  <Text style={[styles.optionText, styles.deleteText]}>Eliminar tarea</Text>
                </Pressable>
              </View>

              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E5EA',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
    marginBottom: 16,
  },
  menuOptions: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    gap: 12,
  },
  deleteOption: {
    backgroundColor: '#FF3B3012',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  deleteText: {
    color: '#FF3B30',
  },
  cancelButton: {
    marginTop: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#E5E5EA',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A3A3C',
  },
});
