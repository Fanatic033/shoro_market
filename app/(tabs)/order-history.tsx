import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import OrderCard from "@/components/Order/OrderDetail";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { ThemedText } from "@/components/ui/ThemedText";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useSafeArea } from "@/hooks/useSafeArea";
import { Order } from "@/store";

const initialOrders: Order[] = [
  {
    id: "#1245",
    createdAt: new Date("2024-08-12"),
    deliveryAddress: "ул. Ленина, 1",
    customerName: "Иван Иванов",
    contactPhone: "+996 555 123 456",
    deliveryDate: '12 сентября',
    products: [
      {
        productId: 1,
        productName: "ШОРО Чалап Классический 0.5л",
        quantity: 1,
        price: 500,
        image: null,
        category: "drinks",
        guid: '122',
        url: null,
        oldPrice: "",
        inPackage: ""
      },
      {
        productId: 2,
        productName: "ШОРО Айран Традиционный 0.5л",
        quantity: 2,
        price: 375,
        image: null,
        category: "drinks",
        guid: '1212',
        url: null,
        oldPrice: "",
        inPackage: ""
      },
    ],
  },
  {
    id: "#1244",
    createdAt: new Date("2024-08-05"),
    total: 860,
    deliveryAddress: "ул. Пушкина, 10",
    customerName: "Петр Петров",
    contactPhone: "+996 555 654 321",
    deliveryDate: '12 сентября',
    products: [{
      productId: 3,
      productName: "ШОРО Боза Домашняя 0.5л",
      quantity: 2,
      price: 430,
      image: null,
      category: "drinks",
      guid: '1313',
      url: null,
      oldPrice: "",
      inPackage: ""
    }],
  },
  {
    id: "#1243",
    createdAt: new Date("2024-07-29"),
    total: 540,
    deliveryAddress: "ул. Гагарина, 5",
    customerName: "Сергей Сергеев",
    contactPhone: "+996 555 789 123",
    deliveryDate: '12 сентября',
    products: [{
      productId: 4,
      productName: "ШОРО Тан с мятой 0.5л",
      quantity: 1,
      price: 540,
      image: null,
      category: "drinks",
      guid: '1414',
      url: null,
      oldPrice: "",
      inPackage: ""
    }],
  },
];

const OrderHistoryScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [refreshing, setRefreshing] = useState(false);
  const [menuOpenOrderId, setMenuOpenOrderId] = useState<string | null>(null);
  const bottomTabOverflow = useBottomTabOverflow();
  const { getBottomPadding } = useSafeArea();
  const bottomPadding = getBottomPadding();
  const { colors } = useAppTheme();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setOrders((prev) => [...prev]);
      setRefreshing(false);
    }, 800);
  }, []);

  const closeMenu = () => setMenuOpenOrderId(null);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: colors.background,
      }}
    >
      <TouchableWithoutFeedback onPress={closeMenu}>
        <View style={{ flex: 1 }}>
          {orders.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="time-outline" size={80}  color={colors.text}   style={{ opacity: 0.6 }} />
              <ThemedText style={styles.emptyTitle}>Заказов пока нет</ThemedText>
              <ThemedText style={styles.emptyText}>
                Вы ещё не совершали покупки
              </ThemedText>
            </View>
          ) : (
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <OrderCard
                  order={item}
                  isMenuOpen={menuOpenOrderId === item.id}
                  onToggleMenu={() =>
                    setMenuOpenOrderId((prev) => (prev === item.id ? null : item.id))
                  }
                  onCloseMenu={closeMenu}
                />
              )}
              contentContainerStyle={{ paddingBottom: bottomTabOverflow + bottomPadding + 10 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
  },
  emptyText: {
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
});
