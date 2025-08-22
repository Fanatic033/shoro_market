import CategoryList from "@/components/Category/CategoryList";
import OrderCard from "@/components/Order/OrderCard";
import ProductCard from "@/components/ProductCard";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { Widget } from "@/components/ui/Widget";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useCartStore, useProductStore } from "@/store";
import { Colors } from "@/utils/constants/Colors";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View
} from "react-native";

const HomeScreen = () => {
  const router = useRouter();
  const { selectedCategory, setSelectedCategory, categories, getFilteredProducts } =
    useProductStore();

  const { addItem, getItemQuantity, isInCart, updateQuantity, removeItem, items } =
    useCartStore();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  const scheme = useColorScheme() ?? "light";
  const isDark = scheme === "dark";

  // const { orders } = useOrderStore();
  const orders = [
    {
      id: "#1245",
      status: "delivered",
      createdAt: new Date(),
      total: 850,
      items: [
        { id: 1, title: "Бургер", quantity: 2, price: 250 },
        { id: 2, title: "Кола", quantity: 1, price: 100 },
        { id: 3, title: "Фри", quantity: 1, price: 250 },
      ],
    },
    {
      id: "#1244",
      status: "preparing",
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      total: 450,
      items: [
        { id: 4, title: "Пицца Маргарита", quantity: 1, price: 450 },
      ],
    },
  ];

  const lastTwoOrders = React.useMemo(() => {
    const sorted = orders
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return [sorted[0] || null, sorted[1] || null];
  }, [orders]);

  // --- адаптивная сетка ---
  const SCREEN_WIDTH = Dimensions.get("window").width;
  
  let numColumns = 2;
  if (SCREEN_WIDTH >= 1200) {
    numColumns = 4; // desktop
  } else if (SCREEN_WIDTH >= 768) {
    numColumns = 3; // tablet
  } else {
    numColumns = 2; // mobile
  }

  const OUTER_HORIZONTAL_PADDING = 32;
  const GUTTER = 16;
  const CARD_WIDTH =
    (SCREEN_WIDTH - OUTER_HORIZONTAL_PADDING - (numColumns - 1) * GUTTER) /
    numColumns;

  const CONTROL_MIN_WIDTH = 40;
  const CONTROL_MAX_WIDTH = CARD_WIDTH - 20;

  const controlWidthsRef = React.useRef<{ [key: number]: Animated.Value }>({}).current;
  
  const getControlWidth = (id: number) => {
    if (!controlWidthsRef[id]) {
      controlWidthsRef[id] = new Animated.Value(CONTROL_MIN_WIDTH);
    }
    return controlWidthsRef[id];
  };

  // ИСПРАВЛЕНИЕ: Следим за изменениями корзины и сбрасываем анимации
  useEffect(() => {
    const currentProductIds = new Set(items.map(item => item.id));
    
    // Для всех продуктов, которые не в корзине, сбрасываем анимацию
    Object.keys(controlWidthsRef).forEach(idStr => {
      const id = parseInt(idStr);
      if (!currentProductIds.has(id)) {
        controlWidthsRef[id].setValue(CONTROL_MIN_WIDTH);
      }
    });
  }, [items, controlWidthsRef, CONTROL_MIN_WIDTH]);

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

  const addToCart = (product: any) => {
    addItem(product);
    impactAsync(ImpactFeedbackStyle.Light);

    const animated = getControlWidth(product.id);
    Animated.timing(animated, {
      toValue: CONTROL_MAX_WIDTH,
      duration: 220,
      easing: Easing.out(Easing.linear),
      useNativeDriver: false,
    }).start();
  };

  const increaseQty = (id: number) => {
    const currentQty = getItemQuantity(id);
    updateQuantity(id, currentQty + 1);
    impactAsync(ImpactFeedbackStyle.Light);

    const animated = getControlWidth(id);
    Animated.timing(animated, {
      toValue: CONTROL_MAX_WIDTH,
      duration: 220,
      easing: Easing.out(Easing.linear),
      useNativeDriver: false,
    }).start();
  };

  const decreaseQty = (id: number) => {
    const currentQty = getItemQuantity(id);

    if (currentQty <= 1) {
      removeItem(id);

      const animated = getControlWidth(id);
      Animated.timing(animated, {
        toValue: CONTROL_MIN_WIDTH,
        duration: 200,
        easing: Easing.inOut(Easing.linear),
        useNativeDriver: false,
      }).start();
    } else {
      updateQuantity(id, currentQty - 1);
    }
  };

  const bottomTabOverflow = useBottomTabOverflow();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[scheme].background }]}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={styles.contentWrapper}>
          {/* Widgets */}
          <FlatList
            data={widgets}
            renderItem={Widget}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.widgetsContainer}
          />

          <View style={styles.ordersRow}>
            <OrderCard order={lastTwoOrders[0]} index={0} />
            <OrderCard order={lastTwoOrders[1]} index={1} />
          </View>

          {/* Categories */}
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {/* Products Grid */}
          <FlatList
            data={getFilteredProducts()}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numColumns}
            renderItem={({ item }) => (
              <ProductCard
                item={item}
                isDark={isDark}
                getControlWidth={getControlWidth}
                addToCart={addToCart}
                increaseQty={increaseQty}
                decreaseQty={decreaseQty}
                CARD_WIDTH={CARD_WIDTH}
              />
            )}
            scrollEnabled={false}
            columnWrapperStyle={{ justifyContent: "center", gap: GUTTER }}
            contentContainerStyle={{
              paddingBottom: bottomTabOverflow,
              paddingHorizontal: OUTER_HORIZONTAL_PADDING / 2,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
});