import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { ThemedText } from "@/components/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type OrderStatus = "processing" | "delivered" | "cancelled";

type OrderItem = {
  id: number;
  title: string;
  quantity: number;
};

type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
};

const initialOrders: Order[] = [
  {
    id: "#1245",
    date: "12.08.2024",
    status: "delivered",
    total: 1250,
    items: [
      { id: 1, title: "ШОРО Чалап Классический 0.5л", quantity: 1 },
      { id: 2, title: "ШОРО Айран Традиционный 0.5л", quantity: 2 },
    ],
  },
  {
    id: "#1244",
    date: "05.08.2024",
    status: "processing",
    total: 860,
    items: [{ id: 3, title: "ШОРО Боза Домашняя 0.5л", quantity: 2 }],
  },
  {
    id: "#1243",
    date: "29.07.2024",
    status: "cancelled",
    total: 540,
    items: [{ id: 4, title: "ШОРО Тан с мятой 0.5л", quantity: 1 }],
  },
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "delivered":
      return { bg: "#e8f8f0", text: "#1e7e34" };
    case "processing":
      return { bg: "#fff4e5", text: "#b85c00" };
    case "cancelled":
      return { bg: "#fdecec", text: "#c81e1e" };
    default:
      return { bg: "#eee", text: "#333" };
  }
};

const OrderHistoryScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [refreshing, setRefreshing] = useState(false);
  const [menuOpenOrderId, setMenuOpenOrderId] = useState<string | null>(null);
  const bottomTabOverflow = useBottomTabOverflow();
  const router = useRouter();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // Stub: here you would refetch orders
      setOrders((prev) => [...prev]);
      setRefreshing(false);
    }, 800);
  }, []);

  // Функция для закрытия меню
  const closeMenu = () => {
    setMenuOpenOrderId(null);
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const colors = getStatusColor(item.status);
    const isMenuOpen = menuOpenOrderId === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.orderId}>{item.id}</ThemedText>
          <View style={styles.headerRight}>
            <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
              <ThemedText style={[styles.statusText, { color: colors.text }]}>
                {item.status === "delivered"
                  ? "Доставлен"
                  : item.status === "processing"
                  ? "В обработке"
                  : "Отменён"}
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={() =>
                setMenuOpenOrderId((prev) =>
                  prev === item.id ? null : item.id
                )
              }
              accessibilityLabel="Показать меню заказа"
              style={styles.menuButton}
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
            </TouchableOpacity>
            {isMenuOpen && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    closeMenu();
                    // Здесь может быть логика повторного заказа
                  }}
                >
                  <Ionicons name="refresh" size={16} color="#111827" />
                  <ThemedText style={styles.dropdownItemText}>
                    Повторить
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    closeMenu();
                    router.push({
                      pathname: "/order/[id]",
                      params: { id: item.id },
                    });
                  }}
                  accessibilityLabel="Перейти к деталям заказа"
                >
                  <Ionicons
                    name="document-text-outline"
                    size={16}
                    color="#111827"
                  />
                  <ThemedText style={styles.dropdownItemText}>
                    Детали
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View style={styles.superRow}>
          <View style={[styles.row, { marginBottom: 0 }]}>
            <Ionicons name="calendar" size={16} color="#6b7280" />
            <ThemedText style={styles.metaText}>{item.date}</ThemedText>
          </View>
          <View style={[styles.row, { marginBottom: 0 }]}>
            <Ionicons name="cube" size={16} color="#6b7280" />
            <ThemedText style={styles.metaText}>
              Товаров: {item.items.reduce((s, it) => s + it.quantity, 0)}
            </ThemedText>
          </View>
        </View>
          
        <View style={[styles.row, { marginBottom: 10 }]}>
          <Ionicons name="cash" size={16} color="#6b7280" />
          <ThemedText style={[styles.metaText, styles.total]}>
            Итого: {item.total.toLocaleString("ru-RU")} ₽
          </ThemedText>
        </View>

        <View style={styles.itemsPreview}>
          {item.items.slice(0, 3).map((it) => (
            <ThemedText key={it.id} numberOfLines={1} style={styles.itemLine}>
              • {it.title} × {it.quantity}
            </ThemedText>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <TouchableWithoutFeedback onPress={closeMenu}>
        <View style={{ flex: 1 }}>
          {orders.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="time-outline" size={80} color="#aaa" />
              <ThemedText style={styles.emptyTitle}>Заказов пока нет</ThemedText>
              <ThemedText style={styles.emptyText}>
                Вы ещё не совершали покупки
              </ThemedText>
            </View>
          ) : (
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id}
              renderItem={renderOrder}
              contentContainerStyle={{ paddingBottom: bottomTabOverflow }}
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    position: "relative",
  },
  menuButton: {
    padding: 4, // Увеличиваем область касания
    borderRadius: 4,
  },
  dropdown: {
    position: "absolute",
    top: 32,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 4,
    minWidth: 140,
    zIndex: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c3e50",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  superRow:{
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  metaText: {
    color: "#374151",
    fontSize: 14,
  },
  total: {
    fontWeight: "700",
  },
  itemsPreview: {
    marginTop: 6,
    marginBottom: 10,
  },
  itemLine: {
    fontSize: 13,
    color: "#4b5563",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  dropdownItemText: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
  },
  primaryBtn: {
    backgroundColor: "#2c3e50",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondaryBtn: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  secondaryBtnText: {
    color: "black",
    fontWeight: "600",
  },
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