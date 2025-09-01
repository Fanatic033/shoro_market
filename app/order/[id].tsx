import { ThemedText } from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


type OrderStatus = "processing" | "delivered" | "cancelled";

type OrderItem = {
  id: number;
  title: string;
  quantity: number;
  price?: number;
};

type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  address?: string;
  items: OrderItem[];
};

const allOrders: Order[] = [
  {
    id: "#1245",
    date: "12.08.2024",
    status: "delivered",
    total: 1250,
    address: "г. Бишкек, пр. Чуй, 120",
    items: [
      { id: 1, title: "ШОРО Чалап Классический 0.5л", quantity: 1, price: 65 },
      { id: 2, title: "ШОРО Айран Традиционный 0.5л", quantity: 2, price: 60 },
    ],
  },
  {
    id: "#1244",
    date: "05.08.2024",
    status: "processing",
    total: 860,
    address: "г. Бишкек, ул. Манаса, 18",
    items: [
      { id: 3, title: "ШОРО Боза Домашняя 0.5л", quantity: 2, price: 80 },
    ],
  },
  {
    id: "#1243",
    date: "29.07.2024",
    status: "cancelled",
    total: 540,
    address: "г. Бишкек, ул. Ю. Абдрахманова, 75",
    items: [
      { id: 4, title: "ШОРО Тан с мятой 0.5л", quantity: 1, price: 70 },
    ],
  },
];

const getStatusConfig = (status: OrderStatus, isDark: boolean = false) => {
  switch (status) {
    case "delivered":
      return {
        gradient: isDark ? ["#059669", "#10b981"] : ["#10b981", "#059669"],
        bg: isDark ? "#134e4a" : "#ecfdf5",
        text: isDark ? "#6ee7b7" : "#065f46",
        icon: "checkmark-circle",
        label: "Доставлен"
      };
    case "processing":
      return {
        gradient: isDark ? ["#d97706", "#f59e0b"] : ["#f59e0b", "#d97706"],
        bg: isDark ? "#78350f" : "#fffbeb",
        text: isDark ? "#fde68a" : "#92400e",
        icon: "time",
        label: "В обработке"
      };
    case "cancelled":
      return {
        gradient: isDark ? ["#dc2626", "#ef4444"] : ["#ef4444", "#dc2626"],
        bg: isDark ? "#7f1d1d" : "#fef2f2",
        text: isDark ? "#fca5a5" : "#991b1b",
        icon: "close-circle",
        label: "Отменён"
      };
    default:
      return {
        gradient: isDark ? ["#4b5563", "#6b7280"] : ["#6b7280", "#4b5563"],
        bg: isDark ? "#1e293b" : "#f9fafb",
        text: isDark ? "#cbd5e1" : "#374151",
        icon: "help-circle",
        label: "Неизвестно"
      };
  }
};

const OrderDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark, adaptiveColor } = useTheme();

  const order = useMemo(() => allOrders.find((o) => o.id === id), [id]);

  if (!order) {
    return (
      <LinearGradient
        colors={isDark ? [colors.background, colors.card] : ['#f8fafc', '#e2e8f0']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: adaptiveColor('rgba(255,255,255,0.9)', colors.card) }] }>
            <View style={styles.backButtonContent}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
              <ThemedText style={[styles.backText, { color: colors.text }]}>Назад</ThemedText>
            </View>
          </TouchableOpacity> */}
          <View style={styles.notFoundContainer}>
            <View style={[styles.notFoundIcon, { backgroundColor: colors.card }] }>
              <Ionicons name="search" size={48} color={colors.secondary} />
            </View>
            <ThemedText style={[styles.notFoundTitle, { color: colors.text }]}>Заказ не найден</ThemedText>
            <ThemedText style={[styles.notFoundSubtitle, { color: colors.secondary }]}>Проверьте номер заказа и попробуйте снова</ThemedText>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const statusConfig = getStatusConfig(order.status, isDark);

  return (
    <LinearGradient
      colors={isDark ? [colors.background, colors.card] as [string, string] : ['#f8fafc', '#e2e8f0'] as [string, string]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        
        {/* Header */}
        <View style={styles.header}>
          {/* <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { borderRadius: 14,backgroundColor: adaptiveColor(colors.border, colors.border) }] }>
            <View style={styles.backButtonContent}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
              <ThemedText style={[styles.backText, { color: colors.text }]}>Назад</ThemedText>
            </View>
          </TouchableOpacity> */}
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Order Header Card */}
          <View style={styles.orderHeaderCard}>
            <LinearGradient
              colors={statusConfig.gradient as [string, string]}
              style={styles.orderHeaderGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.orderHeaderContent}>
                <View style={styles.orderTitleRow}>
                  <ThemedText style={styles.orderTitle}>Заказ {order.id}</ThemedText>
                  <View style={styles.statusIconContainer}>
                    <Ionicons name={statusConfig.icon as any} size={24} color="#ffffff" />
                  </View>
                </View>
                
                <View style={styles.statusContainer}>
                  <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }] }>
                    <ThemedText style={[styles.statusText, { color: statusConfig.text }] }>
                      {statusConfig.label}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Order Info */}
          <View style={[styles.infoCard, { backgroundColor: colors.card }] }>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Информация о заказе</ThemedText>
            
            <View style={styles.infoRow}>
              <View style={[styles.infoIconContainer, { backgroundColor: adaptiveColor('#f1f5f9', colors.border) }] }>
                <Ionicons name="calendar" size={20} color="#3b82f6" />
              </View>
              <View style={styles.infoContent}>
                <ThemedText style={[styles.infoLabel, { color: colors.secondary }]}>Дата заказа</ThemedText>
                <ThemedText style={[styles.infoValue, { color: colors.text }]}>{order.date}</ThemedText>
              </View>
            </View>

            {order.address && (
              <View style={styles.infoRow}>
                <View style={[styles.infoIconContainer, { backgroundColor: adaptiveColor('#f1f5f9', colors.border) }] }>
                  <Ionicons name="location" size={20} color="#10b981" />
                </View>
                <View style={styles.infoContent}>
                  <ThemedText style={[styles.infoLabel, { color: colors.secondary }]}>Адрес доставки</ThemedText>
                  <ThemedText style={[styles.infoValue, { color: colors.text }]}>{order.address}</ThemedText>
                </View>
              </View>
            )}
          </View>

          {/* Order Items */}
          <View style={[styles.itemsCard, { backgroundColor: colors.card }] }>
            <View style={styles.itemsHeader}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Состав заказа</ThemedText>
              <View style={[styles.itemsCountBadge, { backgroundColor: adaptiveColor('#e2e8f0', colors.border) }] }>
                <ThemedText style={[styles.itemsCountText, { color: colors.secondary }] }>
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} шт.
                </ThemedText>
              </View>
            </View>
            
            {order.items.map((item, index) => (
              <View key={item.id} style={[
                styles.itemRow,
                index === order.items.length - 1 && styles.lastItemRow,
                { borderBottomColor: adaptiveColor('#f1f5f9', colors.border) }
              ]}>
                <View style={[styles.itemNumberContainer, { backgroundColor: '#3b82f6' }] }>
                  <ThemedText style={styles.itemNumber}>{index + 1}</ThemedText>
                </View>
                
                <View style={styles.itemContent}>
                  <ThemedText style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
                    {item.title}
                  </ThemedText>
                  <View style={styles.itemDetails}>
                    <ThemedText style={[styles.itemQty, { color: colors.secondary }]}>× {item.quantity}</ThemedText>
                    {item.price && (
                      <ThemedText style={[styles.itemPrice, { color: '#059669' }] }>
                        {(item.price * item.quantity).toLocaleString("ru-RU")} с
                      </ThemedText>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Total */}
          <View style={styles.totalCard}>
            <LinearGradient
              colors={isDark ? ['#334155', '#1e293b'] : ['#1e293b', '#334155']}
              style={styles.totalGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.totalContent}>
                <View style={styles.totalRow}>
                  <ThemedText style={[styles.totalLabel, { color: adaptiveColor(colors.border,colors.text)}]}>Итого к оплате</ThemedText>
                  <ThemedText style={[styles.totalValue, { color: colors.primary }]}>
                    {order.total.toLocaleString("ru-RU")} с
                  </ThemedText>
                </View>
                
                <View style={styles.totalSubRow}>
                  <Ionicons name="card" size={16} color={colors.secondary} />
                  <ThemedText style={[styles.totalSubText, { color: '#94a3b8' }] }>
                    Включая все налоги и сборы
                  </ThemedText>
                </View>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  
  // Order Header Card
  orderHeaderCard: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  orderHeaderGradient: {
    borderRadius: 20,
    padding: 24,
  },
  orderHeaderContent: {
    alignItems: 'center',
  },
  orderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 16,
  },
  orderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
  },
  statusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Info Card
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 16,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
    lineHeight: 22,
  },

  // Items Card
  itemsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemsCountBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  itemsCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 16,
  },
  lastItemRow: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  itemNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  itemNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQty: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },

  // Total Card
  totalCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  totalGradient: {
    borderRadius: 16,
    padding: 24,
  },
  totalContent: {
    alignItems: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  totalSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalSubText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },

  // Not Found
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  notFoundIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  notFoundSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
});