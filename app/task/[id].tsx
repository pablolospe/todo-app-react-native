import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTodoStore } from '../../store/useTodoStore';
import { Priority, PRIORITIES, PRIORITY_COLORS, PRIORITY_LABELS, PRIORITY_ICONS } from '../../constants/priority';
import { getTodayString } from '../../utils/dateHelpers';

export default function TaskModalScreen() {
  const router = useRouter();
  const { id, initialDate } = useLocalSearchParams<{ id: string; initialDate?: string }>();
  const isEditing = id && id !== 'new';

  const { getTaskById, addTask, updateTask, deleteTask, selectedDate } = useTodoStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [date, setDate] = useState(initialDate || selectedDate || getTodayString());
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [existingDate, setExistingDate] = useState(date);

  useEffect(() => {
    if (isEditing) {
      const data = getTaskById(id);
      if (data) {
        setTitle(data.task.title);
        setDescription(data.task.description || '');
        setPriority(data.task.priority);
        setDate(data.task.date);
        setExistingDate(data.date);
        setTags(data.task.tags || []);
      }
    }
  }, [id, isEditing]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Falta título', 'Por favor ingresa un título para la tarea.');
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    if (isEditing) {
      await updateTask(id, existingDate, {
        title: title.trim(),
        description: description.trim(),
        priority,
        date,
        tags,
      });
    } else {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        date,
        tags,
      });
    }

    router.back();
  };

  const handleDelete = async () => {
    if (!isEditing) return;

    const doDelete = async () => {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      await deleteTask(id, existingDate);
      router.back();
    };

    if (Platform.OS === 'web') {
      if (window.confirm('¿Seguro que deseas eliminar esta tarea?')) {
        doDelete();
      }
    } else {
      Alert.alert('Eliminar tarea', '¿Estás seguro de que deseas eliminar esta tarea?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Title input */}
        <View style={styles.section}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="¿Qué necesitas hacer?"
            placeholderTextColor="#8E8E93"
            value={title}
            onChangeText={setTitle}
            autoFocus={!isEditing}
          />
        </View>

        {/* Description input */}
        <View style={styles.section}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detalles adicionales, notas o checklist..."
            placeholderTextColor="#8E8E93"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Priority selector */}
        <View style={styles.section}>
          <Text style={styles.label}>Prioridad</Text>
          <View style={styles.priorityGrid}>
            {PRIORITIES.map((p) => {
              const isSelected = priority === p;
              const color = PRIORITY_COLORS[p];
              return (
                <Pressable
                  key={p}
                  onPress={() => {
                    if (Platform.OS !== 'web') Haptics.selectionAsync();
                    setPriority(p);
                  }}
                  style={[
                    styles.priorityButton,
                    isSelected && {
                      borderColor: color,
                      backgroundColor: `${color}1A`,
                    },
                  ]}>
                  <Text style={styles.priorityIcon}>{PRIORITY_ICONS[p]}</Text>
                  <Text
                    style={[
                      styles.priorityLabel,
                      isSelected && { color, fontWeight: '700' },
                    ]}>
                    {PRIORITY_LABELS[p]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Date string */}
        <View style={styles.section}>
          <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="2026-09-28"
            placeholderTextColor="#8E8E93"
          />
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.label}>Etiquetas</Text>
          <View style={styles.tagInputRow}>
            <TextInput
              style={[styles.input, styles.tagInput]}
              placeholder="Nueva etiqueta..."
              placeholderTextColor="#8E8E93"
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
            />
            <Pressable style={styles.addTagButton} onPress={handleAddTag}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {tags.length > 0 && (
            <View style={styles.tagList}>
              {tags.map((t) => (
                <View key={t} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>#{t}</Text>
                  <Pressable onPress={() => handleRemoveTag(t)} hitSlop={6}>
                    <Ionicons name="close-circle" size={16} color="#8E8E93" />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.buttonsContainer}>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Guardar Cambios' : 'Crear Tarea'}
            </Text>
          </Pressable>

          {isEditing && (
            <Pressable style={styles.deleteButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
              <Text style={styles.deleteButtonText}>Eliminar Tarea</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  section: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    color: '#1C1C1E',
  },
  textArea: {
    height: 90,
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  priorityIcon: {
    fontSize: 14,
  },
  priorityLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3A3A3C',
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagInput: {
    flex: 1,
  },
  addTagButton: {
    backgroundColor: '#007AFF',
    width: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  tagChipText: {
    fontSize: 13,
    color: '#3A3A3C',
    fontWeight: '500',
  },
  buttonsContainer: {
    marginTop: 16,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B3015',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '600',
  },
});
