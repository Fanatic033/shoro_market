import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../ui/ThemedText";

interface CategoryCardProps {
  id: string;
  title: string;
  selected: boolean;
  onPress: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  title,
  selected,
  onPress,
}) => {
  const { adaptiveColor } = useTheme();

  const RED_PRIMARY = "#DC143C";
  const RED_LIGHT = "#FEF2F2";
  const RED_MEDIUM = "#FECACA";

  return (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        { 
          backgroundColor: selected 
            ? adaptiveColor(RED_LIGHT, '#2D1B1B')  // Светло-красный фон для светлой темы, темно-красный для темной
            : adaptiveColor('#F8F9FA', '#2D3748'),
          borderColor: selected 
            ? RED_PRIMARY 
            : 'transparent',
        },
        selected && {
          shadowColor: RED_PRIMARY,
          shadowOpacity: 0.2,
          elevation: 4,
        }
      ]}
      onPress={() => onPress(id)}
      activeOpacity={0.8}
    >
      <ThemedText
        style={[
          styles.categoryTitle,
          {
            color: selected 
              ? RED_PRIMARY 
              : adaptiveColor('#374151', '#D1D5DB'),
            fontWeight: selected ? '700' : '500',
          }
        ]}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  categoryCard: {
    borderRadius: 16,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1.5,
    // Убираем тень для более чистого вида
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryTitle: {
    fontSize: 13,
    textAlign: "center",
    letterSpacing: 0.3,
  },
});