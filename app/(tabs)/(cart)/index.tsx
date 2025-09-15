import CartItem from "@/components/Cart/CartItem"
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground"
import { ThemedText } from "@/components/ui/ThemedText"
import { useAppTheme } from "@/hooks/useAppTheme"
import { useCartStore } from "@/store"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import type React from "react"
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Toast } from "toastify-react-native"

const CartScreen: React.FC = () => {
  const { colors, adaptiveColor } = useAppTheme();
  const router = useRouter();

  const { items: cartItems, subtotal, deliveryCost, total, updateQuantity, removeItem, clearCart } = useCartStore()

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    updateQuantity(productId, quantity)
  }

  const handleRemoveItem = (productId: number) => {
    const removedItem = cartItems.find((item) => item.id === productId)
    Toast.success(`${removedItem?.title} удален из корзины`)
    removeItem(productId)
  }

  const handleClearCart = () => {
    Alert.alert("Очистить корзину?", "Все товары будут удалены. Это действие нельзя отменить.", [
      { text: "Отмена", style: "cancel" },
      { text: "Очистить", style: "destructive", onPress: () => clearCart() },
    ])
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  const bottomTabOverflow = useBottomTabOverflow()

  return (
    <>
      <SafeAreaView
        style={{ 
          flex: 1, 
          padding: 10, 
          backgroundColor: colors.background 
        }}
      >
        <View style={styles.container}>
          {cartItems.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="card" size={80} color={colors.text} style={{ opacity: 0.6 }} />
              <ThemedText style={styles.emptyTitle}>Ваша корзина пуста</ThemedText>
              <ThemedText style={styles.emptyText}>Добавьте товары, чтобы совершить покупку</ThemedText>
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.clearBtn} onPress={handleClearCart}>
                <ThemedText style={styles.clearText}>Очистить</ThemedText>
              </TouchableOpacity>
              <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <CartItem item={item} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} />
                )}
                ListFooterComponent={
                  <View style={styles.summary}>
                    <View style={styles.summaryRow}>
                      <ThemedText>Товары ({cartItems.length})</ThemedText>
                      <ThemedText>{subtotal.toLocaleString("ru-RU")} с</ThemedText>
                    </View>
                    <View style={styles.summaryRow}>
                      <ThemedText>Доставка</ThemedText>
                      <ThemedText style={{ color: deliveryCost === 0 ? "green" : colors.text }}>
                        {deliveryCost === 0 ? "Бесплатно" : `${deliveryCost} с`}
                      </ThemedText>
                    </View>
                    <View style={styles.summaryRow}>
                      <ThemedText style={styles.totalText}>Итого</ThemedText>
                      <ThemedText style={[styles.totalText, { color: colors.text }]}>
                        {total.toLocaleString("ru-RU")} с
                      </ThemedText>
                    </View>

                    <TouchableOpacity style={[styles.checkoutBtn, { backgroundColor: adaptiveColor("#000","#DC143C") }]} onPress={handleCheckout}>
                      <ThemedText style={[styles.checkoutText]}>Оформить заказ</ThemedText>
                    </TouchableOpacity>
                  </View>
                }
                contentContainerStyle={{
                  paddingBottom: bottomTabOverflow,
                }}
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", marginTop: 12 },
  emptyText: { color: "#666", marginTop: 4, textAlign: "center" },
  clearBtn: { flexDirection: "row", alignItems: "center", padding: 12, justifyContent: "flex-end" },
  clearText: { marginLeft: 6, color: "#9e1b32" },
  summary: { padding: 16, borderTopWidth: 1, borderTopColor: "#eee" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  totalText: { fontSize: 18, fontWeight: "700" },
  checkoutBtn: { backgroundColor: "#000000", padding: 14, borderRadius: 8, marginTop: 12 },
  checkoutText: { color: "white", textAlign: "center", fontSize: 16, fontWeight: "600" },
})

export default CartScreen