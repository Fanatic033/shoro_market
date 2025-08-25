"use client"

import CartItem from "@/components/Cart/CartItem"
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground"
import { ThemedText } from "@/components/ui/ThemedText"
import { useSafeArea } from "@/hooks/useSafeArea"
import { useTheme } from "@/hooks/useTheme"
import { useCartStore, useOrderStore } from "@/store"
import { Ionicons } from "@expo/vector-icons"
import type React from "react"
import { useState } from "react"
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { Toast } from "toastify-react-native"

const CartScreen: React.FC = () => {
  const {  colors, adaptiveColor } = useTheme()
  const safeArea = useSafeArea()

  const { items: cartItems, subtotal, deliveryCost, total, updateQuantity, removeItem, clearCart } = useCartStore()

  const { createOrder } = useOrderStore()

  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false)
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    address: "",
    comment: "",
  })

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
    setIsCheckoutModalVisible(true)
  }

  const handleSubmitOrder = () => {
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      Toast.error("Пожалуйста, заполните все обязательные поля")
      return
    }

    // Создаем заказ через store
    createOrder({
      items: cartItems,
      total: total,
      deliveryAddress: checkoutForm.address,
      customerName: checkoutForm.name,
      customerPhone: checkoutForm.phone,
      comment: checkoutForm.comment,
    })

    Toast.success("Заказ успешно оформлен!")
    setIsCheckoutModalVisible(false)
    clearCart() // Очищаем корзину после оформления заказа
    setCheckoutForm({ name: "", phone: "", address: "", comment: "" })
  }

  const bottomTabOverflow = useBottomTabOverflow()

  return (
    <>
      <StatusBar 
        barStyle={adaptiveColor("dark-content", "light-content") as "dark-content" | "light-content"}
        backgroundColor={colors.background}
        translucent={false}
      />
      <SafeAreaView
        style={{ 
          flex: 1, 
          padding: 10, 
          paddingTop: 10 + safeArea.getTopPadding(),
          paddingBottom: 10 + bottomTabOverflow + safeArea.getBottomPadding(), 
          backgroundColor: colors.background 
        }}
      >
        <View style={styles.container}>
          {cartItems.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="card" size={80} color="#aaa" />
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

                    <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                      <ThemedText style={styles.checkoutText}>Оформить заказ</ThemedText>
                    </TouchableOpacity>
                  </View>
                }
                contentContainerStyle={{
                  paddingBottom: bottomTabOverflow,
                }}
              />
            </>
          )}

          {/* Модалка оформления заказа */}
          <Modal
            visible={isCheckoutModalVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setIsCheckoutModalVisible(false)}
          >
            <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
              <View
                style={[
                  styles.modalHeader,
                  {
                    borderBottomColor: adaptiveColor("#eee", "#333"),
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <ThemedText style={styles.modalTitle}>Оформление заказа</ThemedText>
                <TouchableOpacity onPress={() => setIsCheckoutModalVisible(false)} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={adaptiveColor("#666", "#999")} />
                </TouchableOpacity>
              </View>

              <ScrollView style={[styles.modalContent, { backgroundColor: colors.background }]}>
                <View style={styles.formSection}>
                  <ThemedText style={styles.sectionTitle}>Контактная информация</ThemedText>

                  <View style={styles.inputContainer}>
                    <ThemedText style={styles.inputLabel}>Имя *</ThemedText>
                    <TextInput
                      style={[
                        styles.textInput,
                        {
                          borderColor: adaptiveColor("#ddd", "#444"),
                          backgroundColor: adaptiveColor("#f9f9f9", "#2a2a2a"),
                          color: colors.text,
                        },
                      ]}
                      value={checkoutForm.name}
                      onChangeText={(text) => setCheckoutForm({ ...checkoutForm, name: text })}
                      placeholder="Введите ваше имя"
                      placeholderTextColor={adaptiveColor("#999", "#666")}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <ThemedText style={styles.inputLabel}>Телефон *</ThemedText>
                    <TextInput
                      style={[
                        styles.textInput,
                        {
                          borderColor: adaptiveColor("#ddd", "#444"),
                          backgroundColor: adaptiveColor("#f9f9f9", "#2a2a2a"),
                          color: colors.text,
                        },
                      ]}
                      value={checkoutForm.phone}
                      onChangeText={(text) => setCheckoutForm({ ...checkoutForm, phone: text })}
                      placeholder="0700123456"
                      placeholderTextColor={adaptiveColor("#999", "#666")}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <ThemedText style={styles.inputLabel}>Адрес доставки *</ThemedText>
                    <TextInput
                      style={[
                        styles.textInput,
                        {
                          borderColor: adaptiveColor("#ddd", "#444"),
                          backgroundColor: adaptiveColor("#f9f9f9", "#2a2a2a"),
                          color: colors.text,
                        },
                      ]}
                      value={checkoutForm.address}
                      onChangeText={(text) => setCheckoutForm({ ...checkoutForm, address: text })}
                      placeholder="Введите адрес доставки"
                      placeholderTextColor={adaptiveColor("#999", "#666")}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <ThemedText style={styles.inputLabel}>Комментарий к заказу</ThemedText>
                    <TextInput
                      style={[
                        styles.textInput,
                        {
                          borderColor: adaptiveColor("#ddd", "#444"),
                          backgroundColor: adaptiveColor("#f9f9f9", "#2a2a2a"),
                          color: colors.text,
                        },
                      ]}
                      value={checkoutForm.comment}
                      onChangeText={(text) => setCheckoutForm({ ...checkoutForm, comment: text })}
                      placeholder="Дополнительная информация"
                      placeholderTextColor={adaptiveColor("#999", "#666")}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.orderSummary,
                    {
                      backgroundColor: adaptiveColor("#f8f9fa", "#1a1a1a"),
                    },
                  ]}
                >
                  <ThemedText style={styles.sectionTitle}>Сводка заказа</ThemedText>
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
                    <ThemedText style={styles.totalText}>{total.toLocaleString("ru-RU")} с</ThemedText>
                  </View>
                </View>
              </ScrollView>

              <View
                style={[
                  styles.modalFooter,
                  {
                    borderTopColor: adaptiveColor("#eee", "#333"),
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitOrder}>
                  <ThemedText style={styles.submitButtonText}>Подтвердить заказ</ThemedText>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Modal>
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
  clearText: { marginLeft: 6 },
  summary: { padding: 16, borderTopWidth: 1, borderTopColor: "#eee" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  totalText: { fontSize: 18, fontWeight: "700" },
  checkoutBtn: { backgroundColor: "#2c3e50", padding: 14, borderRadius: 8, marginTop: 12 },
  checkoutText: { color: "white", textAlign: "center", fontSize: 16, fontWeight: "600" },

  // Стили для модалки
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold" },
  closeButton: { padding: 8 },
  modalContent: { flex: 1, padding: 16 },
  formSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 16, marginBottom: 8, fontWeight: "500" },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  orderSummary: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalFooter: { padding: 16, borderTopWidth: 1 },
  submitButton: {
    backgroundColor: "#2c3e50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
})

export default CartScreen
