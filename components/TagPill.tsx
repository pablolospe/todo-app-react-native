import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TagPillProps {
  label: string;
  onRemove?: () => void;
}

export const TagPill: React.FC<TagPillProps> = ({ label }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>#{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    color: '#636366',
    fontWeight: '500',
  },
});
