/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, Nativewind, Tamagui, unistyles, etc.
 */

const tintColorLight = "#0a7ea4"
const tintColorDark = "#fff"

export const RedColors = {
  primary: "#DC143C",      // Основной красный
  light: "#FEF2F2",        // Очень светлый для фона
  medium: "#FECACA",       // Средний для hover
  dark: "#B91C1C",         // Темный для активных состояний
  error: "#EF4444",        // Для ошибок
} as const;

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    primary: tintColorLight,
    secondary: "#687076",
    border: "#E5E7EB",
    card: "#F9FAFB",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    primary: tintColorDark,
    secondary: "#9BA1A6",
    border: "#374151",
    card: "#1F2937",
  },
} as const;
