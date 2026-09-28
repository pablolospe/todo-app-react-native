import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Priority, PRIORITY_COLORS, PRIORITY_LABELS, PRIORITY_ICONS } from '../constants/priority';

interface PriorityBadgeProps {
  priority: Priority;
  showIcon?: boolean;
  size?: 'small' | 'medium';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  showIcon = true,
  size = 'small',
}) => {
  const color = PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium;
  const label = PRIORITY_LABELS[priority] || 'Media';
  const icon = PRIORITY_ICONS[priority] || '📌';

  return (
    <View
      style={[
        styles.badge,
        size === 'medium' ? styles.badgeMedium : styles.badgeSmall,
        { backgroundColor: `${color}1A`, borderColor: `${color}4D` },
      ]}>
      {showIcon && <Text style={styles.icon}>{icon}</Text>}
      <Text
        style={[
          styles.text,
          size === 'medium' ? styles.textMedium : styles.textSmall,
          { color },
        ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  badgeMedium: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  icon: {
    fontSize: 12,
  },
  text: {
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 11,
  },
  textMedium: {
    fontSize: 13,
  },
});
