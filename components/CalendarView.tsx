import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { TaskStoreMap } from '../types/task';
import { PRIORITY_COLORS } from '../constants/priority';

// Configure Spanish locale for react-native-calendars
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

interface CalendarViewProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  tasksByDate: TaskStoreMap;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onSelectDate,
  tasksByDate,
}) => {
  // Build marked dates
  const markedDates: Record<string, any> = {};

  Object.entries(tasksByDate).forEach(([date, tasks]) => {
    if (tasks && tasks.length > 0) {
      const pendingTasks = tasks.filter((t) => !t.completed);
      const dots = pendingTasks.slice(0, 3).map((t) => ({
        key: t.id,
        color: PRIORITY_COLORS[t.priority] || PRIORITY_COLORS.medium,
      }));

      markedDates[date] = {
        dots,
        marked: dots.length > 0,
      };
    }
  });

  // Highlight selected date
  markedDates[selectedDate] = {
    ...(markedDates[selectedDate] || {}),
    selected: true,
    selectedColor: '#007AFF',
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={(day: { dateString: string }) => {
          onSelectDate(day.dateString);
        }}
        markingType={'multi-dot'}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#FFFFFF',
          calendarBackground: '#FFFFFF',
          textSectionTitleColor: '#8E8E93',
          selectedDayBackgroundColor: '#007AFF',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#007AFF',
          dayTextColor: '#1C1C1E',
          textDisabledColor: '#D1D1D6',
          dotColor: '#007AFF',
          selectedDotColor: '#FFFFFF',
          arrowColor: '#007AFF',
          monthTextColor: '#1C1C1E',
          textDayFontWeight: '500',
          textMonthFontWeight: '700',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 15,
          textMonthFontSize: 17,
          textDayHeaderFontSize: 13,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
});
