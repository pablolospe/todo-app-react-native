import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface TagFilterModalProps {
  visible: boolean;
  onClose: () => void;
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export const TagFilterModal: React.FC<TagFilterModalProps> = ({
  visible,
  onClose,
  tags,
  selectedTag,
  onSelectTag,
}) => {
  const handleSelect = (tag: string | null) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onSelectTag(tag);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.dragIndicator} />

              <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                  <Ionicons name="pricetag" size={20} color="#007AFF" />
                  <Text style={styles.title}>Filtrar por etiqueta</Text>
                </View>
                <Pressable onPress={onClose} hitSlop={10}>
                  <Ionicons name="close" size={24} color="#8E8E93" />
                </Pressable>
              </View>

              <ScrollView style={styles.tagList} contentContainerStyle={styles.tagListContent}>
                {/* Option for All Tags */}
                <Pressable
                  style={[
                    styles.tagItem,
                    selectedTag === null && styles.tagItemActive,
                  ]}
                  onPress={() => handleSelect(null)}>
                  <Text
                    style={[
                      styles.tagItemText,
                      selectedTag === null && styles.tagItemTextActive,
                    ]}>
                    Todas las etiquetas
                  </Text>
                  {selectedTag === null && (
                    <Ionicons name="checkmark" size={18} color="#007AFF" />
                  )}
                </Pressable>

                {tags.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      No hay etiquetas creadas todavía. Añade etiquetas a tus tareas para filtrarlas aquí.
                    </Text>
                  </View>
                ) : (
                  tags.map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <Pressable
                        key={tag}
                        style={[
                          styles.tagItem,
                          isSelected && styles.tagItemActive,
                        ]}
                        onPress={() => handleSelect(tag)}>
                        <View style={styles.tagLabelRow}>
                          <Text style={styles.hashSymbol}>#</Text>
                          <Text
                            style={[
                              styles.tagItemText,
                              isSelected && styles.tagItemTextActive,
                            ]}>
                            {tag}
                          </Text>
                        </View>
                        {isSelected && (
                          <Ionicons name="checkmark" size={18} color="#007AFF" />
                        )}
                      </Pressable>
                    );
                  })
                )}
              </ScrollView>

              {selectedTag !== null && (
                <Pressable
                  style={styles.clearButton}
                  onPress={() => handleSelect(null)}>
                  <Text style={styles.clearButtonText}>Quitar filtro de etiqueta</Text>
                </Pressable>
              )}
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
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '75%',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  tagList: {
    maxHeight: 280,
  },
  tagListContent: {
    gap: 8,
    paddingVertical: 4,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  tagItemActive: {
    backgroundColor: '#007AFF15',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  tagLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hashSymbol: {
    fontSize: 15,
    fontWeight: '700',
    color: '#007AFF',
  },
  tagItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  tagItemTextActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
  emptyContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  clearButton: {
    marginTop: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#E5E5EA',
  },
  clearButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF3B30',
  },
});
