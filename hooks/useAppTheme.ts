import { Colors } from '@/utils/constants/Colors';
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

export type ColorScheme = 'light' | 'dark';

export interface AppTheme {
  colorScheme: ColorScheme;
  isDark: boolean;
  isLight: boolean;
  colors: typeof Colors.light | typeof Colors.dark;
  // Утилиты для адаптации цветов
  adaptiveColor: (lightColor: string, darkColor: string) => string;
  opacity: (color: string, opacity: number) => string;
}

export const useAppTheme = (): AppTheme => {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  
  const colors = useMemo(() => {
    return Colors[colorScheme];
  }, [colorScheme]);

  // Утилита для выбора цвета в зависимости от темы
  const adaptiveColor = useMemo(() => 
    (lightColor: string, darkColor: string) => {
      return isDark ? darkColor : lightColor;
    }, [isDark]
  );

  // Утилита для добавления прозрачности
  const opacity = useMemo(() => 
    (color: string, alpha: number) => {
      // Если цвет в hex формате
      if (color.startsWith('#')) {
        const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
        return `${color}${alphaHex}`;
      }
      
      // Если цвет в rgb формате, преобразуем в rgba
      if (color.startsWith('rgb(')) {
        return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
      }
      
      // Если уже rgba, заменяем альфа канал
      if (color.startsWith('rgba(')) {
        return color.replace(/,\s*[\d.]+\)$/, `, ${alpha})`);
      }
      
      return color;
    }, []
  );

  return {
    colorScheme,
    isDark,
    isLight: !isDark,
    colors,
    adaptiveColor,
    opacity,
  };
};
