import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import type { Order } from "@/store";
import { Colors } from "@/utils/constants/Colors";

import { ThemedText } from "../ui/ThemedText";

type Props = {
  order: Order | null;
  index: number;
};


const getStatusConfig = (status?: string) => {
    switch (status) {
      case "pending":
        return { bg: "#fffbeb", text: "#92400e", label: "В ожидании" };
      case "confirmed":
        return { bg: "#eff6ff", text: "#1d4ed8", label: "Подтверждён" };
      case "preparing":
        return { bg: "#f0fdf4", text: "#166534", label: "Готовится" };
      case "delivering":
        return { bg: "#ecfeff", text: "#155e75", label: "В пути" };
      case "delivered":
        return { bg: "#ecfdf5", text: "#065f46", label: "Доставлен" };
      case "cancelled":
        return { bg: "#fef2f2", text: "#991b1b", label: "Отменён" };
      default:
        return { bg: "#f3f4f6", text: "#374151", label: "Статус" };
    }
  };

const OrderCard: React.FC<Props> = ({ order, index, }) => {
  const scheme = useColorScheme() ?? "light";
  const isDark = scheme === "dark";

  if (!order) {
    return (
      <View
        key={`empty-${index}`}
        style={[
          styles.orderCard,
          styles.orderCardEmpty,
          {
            backgroundColor: isDark ? "#0f172a" : "#F9FAFB",
            borderColor: isDark ? "#1f2937" : "#E5E7EB",
          },
        ]}
      >
        <ThemedText
          style={[
            styles.orderCardEmptyText,
            { color: isDark ? "#9CA3AF" : "#6B7280" },
          ]}
        >
          Нет заказа
        </ThemedText>
      </View>
    );
  }

  const statusConfig = getStatusConfig((order as any).status);

  return (
    <TouchableOpacity
      key={order.id}
      activeOpacity={0.8}
      onPress={() => router.push(`/order/${encodeURIComponent(order.id)}`)}
      style={[
        styles.orderCard,
        {
          backgroundColor: isDark ? "#111827" : "#FFFFFF",
          borderColor: isDark ? "#1f2937" : "#F0F0F0",
        },
      ]}
    >
      <View style={styles.orderCardHeader}>
        <ThemedText
          style={[styles.orderCardTitle, { color: Colors[scheme].text }]}
        >
          {order.id}
        </ThemedText>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
          <ThemedText
            style={[styles.statusBadgeText, { color: statusConfig.text }]}
          >
            {statusConfig.label}
          </ThemedText>
        </View>
      </View>

      <View style={styles.orderCardMeta}>
        <View style={styles.orderMetaRow}>
          <Ionicons name="cube" size={14} color="#6b7280" />
          <ThemedText
            style={[styles.orderMetaText, { color: Colors[scheme].text }]}
          >
            {order.products?.reduce((sum, item) => sum + item.quantity, 0) || 0} товаров
          </ThemedText>
        </View>
      </View>

      <View style={styles.orderCardFooter}>
        <View style={styles.orderMetaRow}>
          <Ionicons name="calendar" size={14} color="#6b7280" />
          <ThemedText
            style={[styles.orderMetaText, { color: Colors[scheme].text }]}
          >
            {new Date(order.createdAt).toLocaleDateString("ru-RU")}
          </ThemedText>
        </View>
        <ThemedText style={[styles.orderTotal, { color: "#DC143C" }]}>
          {order.total} с
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  orderCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 100,
  },
  orderCardHeader: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderCardTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  orderCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  orderMetaText: {
    fontSize: 12,
    color: "#6b7280",
  },
  orderCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  orderCardEmpty: {
    alignItems: "center",
    justifyContent: "center",
  },
  orderCardEmptyText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
