import BackButton from "@/components/ui/BackButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAddressStore, useCartStore, useOrderStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

export default function CheckoutScreen() {
  const { adaptiveColor, isDark } = useAppTheme();
  const navigation = useNavigation();

  useFocusEffect(() => {
    const parent = navigation.getParent?.();
    parent?.setOptions({
      tabBarStyle: { display: "none" },
    });
    return () => {
      parent?.setOptions({ tabBarStyle: undefined });
    };
  });
  
  const router = useRouter();

  const {
    items: cartItems,
    subtotal,
    deliveryCost,
    total,
    clearCart,
  } = useCartStore();
  const { createOrder } = useOrderStore();
  const defaultAddress = useAddressStore((state) => state.defaultAddress);

 

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    address: defaultAddress?.fullAddress || "",
    comment: "",
    deliveryDate: new Date(Date.now() + 86400000), // Завтра по умолчанию
  });

  // Обновляем адрес в форме при изменении defaultAddress
  useEffect(() => {
    if (defaultAddress?.fullAddress) {
      setCheckoutForm((prev) => ({
        ...prev,
        address: defaultAddress.fullAddress,
      }));
    }
  }, [defaultAddress]);

  const handleAddressPress = () => {
    router.push("/(tabs)/(profile)/addresses");
  };

  const handleSubmitOrder = () => {
    if (
      !checkoutForm.name ||
      !checkoutForm.phone ||
      !checkoutForm.address ||
      !checkoutForm.deliveryDate
    ) {
      Toast.error("Пожалуйста, заполните все обязательные поля");
      return;
    }

    // Создаем заказ через store
    createOrder({
      items: cartItems,
      total: total,
      deliveryAddress: checkoutForm.address,
      customerName: checkoutForm.name,
      customerPhone: checkoutForm.phone,
      comment: checkoutForm.comment,
      deliveryDate: checkoutForm.deliveryDate.toISOString().split("T")[0], // Формат YYYY-MM-DD
    });

    Toast.success("Заказ успешно оформлен!");
    clearCart(); // Очищаем корзину после оформления заказа
    router.back(); // Возвращаемся к корзине
  };
 

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: adaptiveColor("#f9fafb", "#0f172a"),
      }}
    >
      {/* Header */}
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          gap: 12,
          backgroundColor: adaptiveColor("#ffffff", "#1e293b"),
          borderBottomWidth: 1,
          borderBottomColor: adaptiveColor("#e5e7eb", "#334155"),
          shadowColor: adaptiveColor("#000000", "#000000"),
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.1 : 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <BackButton />
        <View style={{ flex: 1, alignItems: "center" }}>
          <ThemedText
            type="title"
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: adaptiveColor("#111827", "#f8fafc"),
            }}
          >
            Оформление заказа
          </ThemedText>
        </View>
        <View style={{ width: 40 }} />
      </ThemedView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <ThemedView
            style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24 }}
          >
            <View style={{ gap: 24 }}>
              {/* Contact Information Section */}
              <View style={{ gap: 20 }}>
                <ThemedText
                  type="defaultSemiBold"
                  style={{
                    fontSize: 18,
                    color: adaptiveColor("#111827", "#f8fafc"),
                  }}
                >
                  Контактная информация
                </ThemedText>

                <View style={{ gap: 16 }}>
                  {/* Name Input */}
                  <View style={{ gap: 8 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons
                        name="person"
                        size={16}
                        color={adaptiveColor("#6b7280", "#9ca3af")}
                      />
                      <ThemedText
                        type="defaultSemiBold"
                        style={{ color: adaptiveColor("#374151", "#d1d5db") }}
                      >
                        Имя *
                      </ThemedText>
                    </View>
                    <TextInput
                      placeholder="Введите ваше имя"
                      placeholderTextColor={adaptiveColor("#9ca3af", "#6b7280")}
                      value={checkoutForm.name}
                      onChangeText={(text) =>
                        setCheckoutForm({ ...checkoutForm, name: text })
                      }
                      style={{
                        borderWidth: 2,
                        borderColor: adaptiveColor("#e5e7eb", "#374151"),
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        fontSize: 16,
                        backgroundColor: adaptiveColor("#fafafa", "#1f2937"),
                        color: adaptiveColor("#111827", "#f9fafb"),
                      }}
                    />
                  </View>

                  {/* Phone Input */}
                  <View style={{ gap: 8 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons
                        name="call"
                        size={16}
                        color={adaptiveColor("#6b7280", "#9ca3af")}
                      />
                      <ThemedText
                        type="defaultSemiBold"
                        style={{ color: adaptiveColor("#374151", "#d1d5db") }}
                      >
                        Телефон *
                      </ThemedText>
                    </View>
                    <TextInput
                      placeholder="0700123456"
                      placeholderTextColor={adaptiveColor("#9ca3af", "#6b7280")}
                      value={checkoutForm.phone}
                      onChangeText={(text) =>
                        setCheckoutForm({ ...checkoutForm, phone: text })
                      }
                      keyboardType="phone-pad"
                      style={{
                        borderWidth: 2,
                        borderColor: adaptiveColor("#e5e7eb", "#374151"),
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        fontSize: 16,
                        backgroundColor: adaptiveColor("#fafafa", "#1f2937"),
                        color: adaptiveColor("#111827", "#f9fafb"),
                      }}
                    />
                  </View>

                  {/* Address Input */}
                  <View style={{ gap: 8 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons
                        name="location"
                        size={16}
                        color={adaptiveColor("#6b7280", "#9ca3af")}
                      />
                      <ThemedText
                        type="defaultSemiBold"
                        style={{ color: adaptiveColor("#374151", "#d1d5db") }}
                      >
                        Адрес доставки *
                      </ThemedText>
                    </View>
                    <Pressable
                      onPress={handleAddressPress}
                      style={{
                        borderWidth: 2,
                        borderColor: adaptiveColor("#e5e7eb", "#374151"),
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        backgroundColor: adaptiveColor("#fafafa", "#1f2937"),
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <ThemedText
                        style={{
                          color: checkoutForm.address
                            ? adaptiveColor("#111827", "#f9fafb")
                            : adaptiveColor("#9ca3af", "#6b7280"),
                          flex: 1,
                          fontSize: 16,
                        }}
                      >
                        {checkoutForm.address || "Нажмите для выбора адреса"}
                      </ThemedText>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={adaptiveColor("#6b7280", "#9ca3af")}
                      />
                    </Pressable>
                  </View>

                  {/* Delivery Date Input */}
                  <View style={{ gap: 8 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons
                        name="calendar"
                        size={16}
                        color={adaptiveColor("#6b7280", "#9ca3af")}
                      />
                      <ThemedText
                        type="defaultSemiBold"
                        style={{ color: adaptiveColor("#374151", "#d1d5db") }}
                      >
                        Дата доставки *
                      </ThemedText>
                    </View>
                    <Pressable
                      onPress={() => setShowDatePicker(true)}
                      style={{
                        borderWidth: 2,
                        borderColor: adaptiveColor("#e5e7eb", "#374151"),
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        backgroundColor: adaptiveColor("#fafafa", "#1f2937"),
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <ThemedText
                        style={{
                          color: adaptiveColor("#111827", "#f9fafb"),
                          fontSize: 16,
                        }}
                      >
                        {new Date(checkoutForm.deliveryDate).toLocaleDateString(
                          "ru-RU",
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          }
                        )}
                      </ThemedText>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={adaptiveColor("#6b7280", "#9ca3af")}
                      />
                    </Pressable>

                    {showDatePicker && (
                      <RNDateTimePicker
                        value={new Date(checkoutForm.deliveryDate)}
                        mode="date"
                        display="default"
                        minimumDate={new Date(Date.now() + 86400000)} // Завтра
                        maximumDate={
                          new Date(Date.now() + 86400000 + 6 * 86400000)
                        } // +7 дней от завтра
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) {
                            setCheckoutForm({
                              ...checkoutForm,
                              deliveryDate: selectedDate,
                            });
                          }
                        }}
                      />
                    )}
                  </View>

                  {/* Comment Input */}
                  <View style={{ gap: 8 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons
                        name="chatbubble"
                        size={16}
                        color={adaptiveColor("#6b7280", "#9ca3af")}
                      />
                      <ThemedText
                        type="defaultSemiBold"
                        style={{ color: adaptiveColor("#374151", "#d1d5db") }}
                      >
                        Комментарий к заказу
                      </ThemedText>
                    </View>
                    <TextInput
                      placeholder="Дополнительная информация"
                      placeholderTextColor={adaptiveColor("#9ca3af", "#6b7280")}
                      value={checkoutForm.comment}
                      onChangeText={(text) =>
                        setCheckoutForm({ ...checkoutForm, comment: text })
                      }
                      multiline
                      numberOfLines={3}
                      style={{
                        borderWidth: 2,
                        borderColor: adaptiveColor("#e5e7eb", "#374151"),
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        fontSize: 16,
                        backgroundColor: adaptiveColor("#fafafa", "#1f2937"),
                        color: adaptiveColor("#111827", "#f9fafb"),
                        textAlignVertical: "top",
                      }}
                    />
                  </View>
                </View>
              </View>

              {/* Order Summary */}
              <View
                style={{
                  padding: 20,
                  borderRadius: 16,
                  backgroundColor: adaptiveColor("#ffffff", "#1e293b"),
                  borderWidth: 1,
                  borderColor: adaptiveColor("#e5e7eb", "#334155"),
                  shadowColor: adaptiveColor("#000000", "#000000"),
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isDark ? 0.09 : 0.08,
                  shadowRadius: 12,
                  elevation: 4,
                }}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={{
                    fontSize: 18,
                    marginBottom: 16,
                    color: adaptiveColor("#111827", "#f8fafc"),
                  }}
                >
                  Сводка заказа
                </ThemedText>

                <View style={{ gap: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ThemedText
                      style={{ color: adaptiveColor("#6b7280", "#9ca3af") }}
                    >
                      Товары ({cartItems.length})
                    </ThemedText>
                    <ThemedText
                      style={{ color: adaptiveColor("#111827", "#f9fafb") }}
                    >
                      {subtotal.toLocaleString("ru-RU")} с
                    </ThemedText>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ThemedText
                      style={{ color: adaptiveColor("#6b7280", "#9ca3af") }}
                    >
                      Доставка
                    </ThemedText>
                    <ThemedText
                      style={{
                        color:
                          deliveryCost === 0
                            ? "#10b981"
                            : adaptiveColor("#111827", "#f9fafb"),
                      }}
                    >
                      {deliveryCost === 0 ? "Бесплатно" : `${deliveryCost} с`}
                    </ThemedText>
                  </View>

                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: adaptiveColor("#e5e7eb", "#374151"),
                      paddingTop: 12,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ThemedText
                      type="defaultSemiBold"
                      style={{
                        fontSize: 18,
                        color: adaptiveColor("#111827", "#f9fafb"),
                      }}
                    >
                      Итого
                    </ThemedText>
                    <ThemedText
                      type="defaultSemiBold"
                      style={{
                        fontSize: 18,
                        color: adaptiveColor("#111827", "#f9fafb"),
                      }}
                    >
                      {total.toLocaleString("ru-RU")} с
                    </ThemedText>
                  </View>
                </View>
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handleSubmitOrder}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? adaptiveColor("#b91c1c", "#dc2626")
                      : adaptiveColor("#dc2626", "#ef4444"),
                    paddingVertical: 16,
                    borderRadius: 14,
                    alignItems: "center",
                    shadowColor: adaptiveColor("#dc2626", "#ef4444"),
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                  <ThemedText
                    style={{
                      color: "#ffffff",
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Подтвердить заказ
                  </ThemedText>
                </View>
              </Pressable>
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
