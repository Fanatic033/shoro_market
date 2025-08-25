import React from "react";
import { FlatList, StyleSheet } from "react-native";
import CategoryCard from "./CategoryCard";

interface Category {
  id: string;
  title: string;
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
