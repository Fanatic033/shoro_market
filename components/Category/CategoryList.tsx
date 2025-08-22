import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import CategoryCard from "./CategoryCard";

interface Category {
  id: string;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  bgColor: string;
}

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (id: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelect,
}) => {
  return (
    <FlatList
      data={categories}
      renderItem={({ item }) => (
        <CategoryCard
          id={item.id}
          title={item.title}
          iconName={item.iconName}
          bgColor={item.bgColor}
          selected={selectedCategory === item.id}
          onPress={onSelect}
        />
      )}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
    />
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  categoriesContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
