# 📋 Plan de Acción — Daily To-Do App (React Native Universal)

## 🎯 Resumen del Proyecto

| Campo | Decisión |
| :--- | :--- |
| **Framework** | Expo (React Native universal) |
| **Plataformas** | iOS, Android + Web |
| **Login** | Sin login, 100% local |
| **Persistencia** | AsyncStorage (offline, simple) |
| **Campos de tarea** | Título, descripción, etiquetas, prioridad, fecha |
| **UI Especial** | Drag & Drop, calendario, colores por prioridad |

---

## 🧱 Stack Tecnológico

| Rol | Librería | Por qué |
|---|---|---|
| Base | `Expo SDK 51+` | Universal (iOS/Android/Web), sin config nativa |
| Navegación | `Expo Router v3` | File-based routing, funciona en web también |
| Drag & Drop | `react-native-reanimated` + `react-native-gesture-handler` | Base para gestos fluidos |
| Drag & Drop lista | `@brenopolanski/react-native-sortable-list` o **`react-native-draggable-flatlist`** | El más estable con Reanimated |
| Calendario | `react-native-calendars` | Muy completo, marca días con tareas |
| Persistencia | `@react-native-async-storage/async-storage` | Simple, sin configuración extra |
| Estado global | `Zustand` | Más simple que Redux, perfecto para este scope |
| Estilos | `StyleSheet` nativo + tokens de diseño propios | Sin dependencias extra |
| Iconos | `@expo/vector-icons` | Incluido en Expo |
| Notificaciones (opcional) | `expo-notifications` | Para recordatorios de tareas |

---

## 🏗️ Estructura de Carpetas

```
todo-app/
├── app/                        # Expo Router (páginas)
│   ├── (tabs)/
│   │   ├── index.tsx           # Vista: Lista del día
│   │   ├── calendar.tsx        # Vista: Calendario
│   │   └── _layout.tsx
│   ├── task/[id].tsx           # Modal: Editar tarea
│   └── _layout.tsx
├── components/
│   ├── TaskCard.tsx            # Card con color de prioridad
│   ├── DraggableList.tsx       # Lista con drag & drop
│   ├── PriorityBadge.tsx       # Chip de prioridad
│   ├── CalendarView.tsx        # Wrapper del calendario
│   ├── AddTaskFAB.tsx          # Botón flotante "+" 
│   └── TagPill.tsx             # Chips de etiquetas
├── store/
│   └── useTodoStore.ts         # Zustand store principal
├── hooks/
│   └── useTasks.ts             # Hook para leer/escribir tareas
├── utils/
│   ├── storage.ts              # Wrapper de AsyncStorage
│   └── dateHelpers.ts          # Helpers de fechas
└── constants/
    └── priority.ts             # Colores y labels de prioridad
```

---

## 📦 Modelo de Datos

```typescript
// Prioridades posibles
type Priority = 'urgent' | 'high' | 'medium' | 'low';

// Colores por prioridad
const PRIORITY_COLORS: Record<Priority, string> = {
  urgent: '#FF3B30',  // Rojo
  high:   '#FF9500',  // Naranja
  medium: '#FFCC00',  // Amarillo
  low:    '#34C759',  // Verde
};

// Estructura de una tarea
interface Task {
  id: string;           // UUID
  title: string;
  description?: string;
  tags: string[];
  priority: Priority;
  date: string;         // 'YYYY-MM-DD' — día al que pertenece
  order: number;        // Para mantener el orden drag & drop
  completed: boolean;
  createdAt: string;    // ISO timestamp
}

// Storage: un objeto indexado por fecha
type TaskStore = {
  [date: string]: Task[];  // Ejemplo: { '2026-09-28': [...] }
};
```

---

## 🗓️ Fases de Desarrollo

### Fase 1 — Fundación (Días 1–3)
- [ ] Crear proyecto con `npx create-expo-app@latest ./`
- [ ] Configurar Expo Router con las 2 tabs (Lista + Calendario)
- [ ] Instalar y configurar todas las dependencias
- [ ] Implementar `storage.ts` (leer/escribir en AsyncStorage)
- [ ] Crear Zustand store con operaciones CRUD básicas
- [ ] Definir tokens de color y tipografía

### Fase 2 — Lista del Día (Días 4–7)
- [ ] Componente `TaskCard` con indicador de color según prioridad
- [ ] Lista estática con las tareas del día seleccionado
- [ ] Botón flotante "+" para agregar tarea
- [ ] Modal/pantalla de creación/edición de tarea (título, descripción, prioridad, tags)
- [ ] Marcar tarea como completada (swipe o checkbox)
- [ ] Eliminar tarea (swipe o botón)

### Fase 3 — Drag & Drop (Días 8–10)
- [ ] Integrar `react-native-draggable-flatlist`
- [ ] Persistir el nuevo orden en AsyncStorage tras soltar
- [ ] Animación de elevación al arrastrar (sombra + escala)
- [ ] Asegurar que funciona en iOS, Android y Web

### Fase 4 — Calendario (Días 11–13)
- [ ] Tab de calendario con `react-native-calendars`
- [ ] Marcar los días que tienen tareas pendientes (dots de colores)
- [ ] Al tocar un día → mostrar sus tareas debajo
- [ ] **"Mover tarea a otro día"**: long press en una tarea → botón "Mover a..." → date picker

### Fase 5 — Polish y UX (Días 14–16)
- [ ] Animaciones de entrada/salida de tareas (`Reanimated`)
- [ ] Feedback háptico al completar o mover tarea
- [ ] Pantalla vacía amigable si no hay tareas ("No tasks for today 🎉")
- [ ] Filtros rápidos: ver solo urgentes, solo completadas, etc.
- [ ] Soporte de tema oscuro automático

### Fase 6 — Build Final (Días 17–18)
- [ ] Testeo en simuladores iOS y Android
- [ ] Testeo en web (`npx expo start --web`)
- [ ] Build con `EAS Build` para generar `.apk` / `.ipa`

---

## 🎨 Sistema de Prioridades (UX)

| Prioridad | Color | Ícono | Uso sugerido |
|---|---|---|---|
| 🔴 **Urgente** | Rojo `#FF3B30` | `⚡` | Vence hoy, bloqueante |
| 🟠 **Alta** | Naranja `#FF9500` | `🔥` | Importante esta semana |
| 🟡 **Media** | Amarillo `#FFCC00` | `📌` | Normal, sin urgencia |
| 🟢 **Baja** | Verde `#34C759` | `💤` | "Algún día" |

---

## 🔄 Flujo de "Mover tarea a otro día"

```
Long press en TaskCard
  → Aparece menú contextual (bottom sheet)
    → Opciones: "Mover a mañana" / "Elegir fecha" / "Duplicar"
      → Se borra del día origen y se inserta en el día destino
        → Toast de confirmación ("Movida al 29 Sep ✓")
```

---

## ⚠️ Riesgos a tener en cuenta

> [!WARNING]
> **Drag & Drop en Web**: `react-native-draggable-flatlist` puede tener limitaciones en la plataforma web. Puede requerir un fallback especial para web usando eventos de mouse.

> [!NOTE]
> **AsyncStorage en Web**: En plataforma web, AsyncStorage usa `localStorage` del browser automáticamente. Los datos no se sincronizan entre dispositivos. Si en el futuro se quiere sync, migrar a Supabase sería el paso natural.

---

## 🚀 Próximo paso recomendado

Una vez aprobado este plan, el primer comando a ejecutar es:

```bash
npx create-expo-app@latest ./ --template tabs
cd todo-app
npx expo install react-native-reanimated react-native-gesture-handler @react-native-async-storage/async-storage zustand react-native-draggable-flatlist react-native-calendars
```
