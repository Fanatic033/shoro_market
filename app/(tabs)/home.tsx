import CategoryList from "@/components/Category/CategoryList";
import OrderCard from "@/components/Order/OrderCard";
import ProductCard from "@/components/ProductCard";
import { ProductSkeletonCard } from "@/components/ui/Skeleton";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { ThemedText } from "@/components/ui/ThemedText";
import { Widget } from "@/components/ui/Widget";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useCartStore, useProductStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  
  const {
    selectedCategory,
    setSelectedCategory,
    categories,
    getFilteredProducts,
    loadRemoteProducts,
    error,
    isLoading,
  } = useProductStore();

  const { addItem, getItemQuantity, updateQuantity, removeItem } =
    useCartStore();
  // Привязку userId к корзине делает authStore при логине/гидратации/логауте


  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  const { colorScheme, isDark, colors } = useAppTheme();
  useEffect(() => {
    loadRemoteProducts();
  }, [loadRemoteProducts]);

  // const { orders } = useOrderStore();
  const lastTwoOrders = useMemo(() => {
    const orders = [
      {
        id: "#1245",
        status: "delivered" as const,
        createdAt: new Date(),
        total: 850,
        deliveryAddress: "ул. Ленина, 1", 
        customerName: "Иван Иванов",
        customerPhone: "+996 555 123 456",
        items: [
          { id: 1, title: "Бургер", quantity: 2, price: 250, image: null, category: "Напитки" },
          { id: 2, title: "Кола", quantity: 1, price: 100, image: null, category: "Стаканы" },
          { id: 3, title: "Фри", quantity: 1, price: 250, image: null, category: "fast-food" },
        ],
      },
      {
        id: "#1244",
        status: "preparing" as const,
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
        total: 450,
        deliveryAddress: "ул. Пушкина, 10",
        customerName: "Петр Петров",
        customerPhone: "+996 555 654 321",
        items: [
          {
            id: 4,
            title: "Пицца Маргарита",
            quantity: 1,
            price: 450,
            image: null,
            category: "pizza",
          },
        ],
      },
    ];

    const sorted = orders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return [sorted[0] || null, sorted[1] || null];
  }, []);

  const SCREEN_WIDTH = Dimensions.get("window").width;

  let numColumns = 2;
  

  const OUTER_HORIZONTAL_PADDING = 32;
  const GUTTER = 16;
  const CARD_WIDTH =
    (SCREEN_WIDTH - OUTER_HORIZONTAL_PADDING - (numColumns - 1) * GUTTER) /
    numColumns;

  

  const widgets = [
    {
      id: 1,
      type: "promo",
      title: "Скидка 25%",
      subtitle: "На все напитки ШОРО",
      bgColor: "#DC143C",
      textColor: "#FFFFFF",
      iconName: "gift",
    },
    {
      id: 2,
      type: "delivery",
      title: "Быстрая доставка",
      subtitle: "От 30 минут",
      bgColor: "#000000",
      textColor: "#FFFFFF",
      iconName: "bicycle",
    },
  ];

  const addToCart = useCallback((product: any) => {
    addItem(product);
    
    impactAsync(ImpactFeedbackStyle.Light);
  }, [addItem]);
  
  const increaseQty = useCallback((id: number) => {
    const currentQty = getItemQuantity(id);
    updateQuantity(id, currentQty + 1);
    
    impactAsync(ImpactFeedbackStyle.Light);
  }, [getItemQuantity, updateQuantity]);
  
  const decreaseQty = useCallback((id: number) => {
    const currentQty = getItemQuantity(id);
  
    if (currentQty <= 1) {
      removeItem(id);
    } else {
      updateQuantity(id, currentQty - 1);
    }
    
    impactAsync(ImpactFeedbackStyle.Light);
  }, [getItemQuantity, removeItem, updateQuantity]);
  
  // Удалён общий менеджмент анимаций — каждый ProductCard сам управляет своей шириной

  const bottomTabOverflow = useBottomTabOverflow();

  // --- Анимация списка продуктов при смене категории ---
  const listOpacity = useRef(new Animated.Value(1)).current;
  const listTranslate = useRef(new Animated.Value(0)).current;

  // --- Scroll to top button logic ---
  const scrollRef = useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const handleScroll = useCallback((event: any) => {
    const offsetY = event?.nativeEvent?.contentOffset?.y ?? 0;
    setShowScrollTop(offsetY > 300);
  }, []);
  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(listOpacity, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(listTranslate, {
          toValue: 8,
          duration: 120,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(listOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(listTranslate, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  return (
    <>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
        translucent={false}
      />
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ScrollView
          ref={scrollRef}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center" }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          stickyHeaderIndices={[2]}
        >
          {/* Widgets */}
          <View style={styles.contentWrapper}>
            <FlatList
              data={widgets}
              renderItem={Widget}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.widgetsContainer}
            />
          </View>

          <View style={[styles.contentWrapper, styles.ordersRow]}>
            <OrderCard order={lastTwoOrders[0]} index={0} />
            <OrderCard order={lastTwoOrders[1]} index={1} />
          </View>

          {/* Sticky Categories */}
          <View style={[styles.contentWrapper, styles.stickyHeader]}>
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </View>

          {/* Products Grid */}
          <Animated.View
            style={[
              styles.contentWrapper,
              {
                opacity: listOpacity,
                transform: [{ translateY: listTranslate }],
              },
            ]}
          >
            {error ? (
              <ThemedText style={{ paddingHorizontal: 16, color: "red", display: 'none' }}>
                {error}
              </ThemedText>
            ) : null}
            {isLoading ? (
              <FlatList
                data={Array.from({ length: numColumns * 2 })}
                keyExtractor={(_, i) => `sk-${i}`}
                numColumns={numColumns}
                renderItem={() => <ProductSkeletonCard width={CARD_WIDTH} />}
                scrollEnabled={false}
                columnWrapperStyle={{ justifyContent: "center", gap: GUTTER }}
                contentContainerStyle={{
                  paddingBottom: bottomTabOverflow,
                  paddingHorizontal: OUTER_HORIZONTAL_PADDING / 2,
                }}
              />
            ) : (
              <FlatList
                data={getFilteredProducts()}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                renderItem={({ item }) => (
                  <ProductCard
                    item={item}
                    isDark={isDark}
                    addToCart={addToCart}
                    increaseQty={increaseQty}
                    decreaseQty={decreaseQty}
                    CARD_WIDTH={CARD_WIDTH}
                  />
                )}
                ListEmptyComponent={
                  !isLoading ? (
                    <View style={styles.emptyStateContainer}>
                      <View style={styles.emptyStateIconContainer}>
                        <Ionicons 
                          name="sad-outline" 
                          size={64} 
                          color={colors.text} 
                          style={{ opacity: 0.6 }}
                        />
                      </View>
                      <ThemedText style={styles.emptyStateTitle}>
                        Товары не найдены
                      </ThemedText>
                      <ThemedText style={styles.emptyStateSubtitle}>
                        Попробуйте обновить список Товаров
                      </ThemedText>
                    </View>
                  ) : null
                }
                scrollEnabled={false}
                columnWrapperStyle={{ justifyContent: "center", gap: GUTTER }}
                contentContainerStyle={{
                  paddingBottom: bottomTabOverflow,
                  paddingHorizontal: OUTER_HORIZONTAL_PADDING / 2,
                }}
              />
            )}
          </Animated.View>
        </ScrollView>
        {showScrollTop ? (
          <TouchableOpacity
            onPress={scrollToTop}
            activeOpacity={0.85}
            style={{
              position: "absolute",
              right: 16,
              bottom: 16 + bottomTabOverflow,
              backgroundColor: colors.card,
              borderRadius: 24,
              padding: 12,
              elevation: 6,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 6,
            }}
          >
            <Ionicons name="arrow-up" size={22} color={colors.text} />
          </TouchableOpacity>
        ) : null}
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  contentWrapper: {
    width: "100%",
    maxWidth: 1200,
  },

  widgetsContainer: {
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
  },

  categoriesContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  ordersRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 10,
    marginBottom: 16,
  },

  stickyHeader: {
    backgroundColor: "transparent",
    zIndex: 10,
    elevation: 4,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateIconContainer: {
    marginBottom: 15,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
});
