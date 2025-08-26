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
  const keyExtractor = React.useCallback((item: Category) => item.id, []);
  const renderItem = React.useCallback(({ item }: { item: Category }) => (
    <CategoryCard
      id={item.id}
      title={item.title}
      selected={selectedCategory === item.id}
      onPress={onSelect}
    />
  ), [onSelect, selectedCategory]);

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
    />
  );
};

export default React.memo(CategoryList);

const styles = StyleSheet.create({
  categoriesContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
