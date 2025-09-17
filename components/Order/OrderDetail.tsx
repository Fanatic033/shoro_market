import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from "@/components/ui/ThemedText";
import { Order, useCartStore } from "@/store";


type Props = {
  order: Order;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
};

const OrderCard: React.FC<Props> = ({ order, isMenuOpen, onToggleMenu, onCloseMenu }) => {
  const router = useRouter();
  const addItemsFromOrder = useCartStore((s) => s.addItemsFromOrder);

  const total = order?.products.reduce((sum, item) => sum + item.price, 0)

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.orderId}>{order.id}</ThemedText>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={onToggleMenu}
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
                  onCloseMenu();
                  addItemsFromOrder(order.products);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  setTimeout(() => {
                    router.push('/(tabs)/(cart)');
                  }, Platform.select({ ios: 120, android: 120, default: 120 }));
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
                  onCloseMenu();
                  router.push({
                    pathname: "/order/[id]",
                    params: { id: order.id },
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
          <ThemedText style={styles.metaText}>{new Date(order.createdAt).toLocaleDateString("ru-RU")}</ThemedText>
        </View>
        <View style={[styles.row, { marginBottom: 0 }]}>
          <Ionicons name="cube" size={16} color="#6b7280" />
          <ThemedText style={styles.metaText}>
            Товаров: {order.products.reduce((s, it) => s + it.quantity, 0)}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.row, { marginBottom: 10 }]}>
        <Ionicons name="cash" size={16} color="#6b7280" />
        <ThemedText style={[styles.metaText, styles.total]}>
          Итого: {total} с
        </ThemedText>
      </View>

      <View style={styles.itemsPreview}>
        {order.products.slice(0, 3).map((it) => (
          <ThemedText key={it.productId} numberOfLines={1} style={styles.itemLine}>
            • {it.productName} × {it.quantity}
          </ThemedText>
        ))}
      </View>
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  card: {
    marginTop: 2,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
     shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
    padding: 4,
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
  superRow: {
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
});
