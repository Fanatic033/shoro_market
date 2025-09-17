import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { useMemo, useState } from "react";
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

import BackButton from "@/components/ui/BackButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAddressStore } from "@/store";

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: string;
  adaptiveColor: (light: string, dark: string) => string;
}

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  adaptiveColor,
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Ionicons
          name={icon as any}
          size={16}
          color={adaptiveColor("#6b7280", "#9ca3af")}
        />
        <ThemedText
          type="defaultSemiBold"
          style={{ color: adaptiveColor("#374151", "#d1d5db") }}
        >
          {label}
        </ThemedText>
      </View>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={adaptiveColor("#9ca3af", "#6b7280")}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          borderWidth: 2,
          borderColor: isFocused
            ? adaptiveColor("#000", "#fff")
            : adaptiveColor("#e5e7eb", "#374151"),
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          fontSize: 16,
          backgroundColor: adaptiveColor("#fafafa", "#1f2937"),
          color: adaptiveColor("#111827", "#f9fafb"),
          shadowColor: isFocused
            ? adaptiveColor("#dc2626", "#ef4444")
            : "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: isFocused ? 0.1 : 0,
          shadowRadius: 8,
          elevation: isFocused ? 2 : 0,
        }}
      />
    </View>
  );
};

export default function AddressesScreen() {
  const { adaptiveColor, isDark } = useAppTheme();
  const navigation = useNavigation();
  const router = useRouter();
  const defaultAddress = useAddressStore((state) => state.defaultAddress);
  const addAddress = useAddressStore((state) => state.addAddress);
  const updateAddress = useAddressStore((state) => state.updateAddress);

  useFocusEffect(() => {
    const parent = navigation.getParent?.();
    parent?.setOptions({
      tabBarStyle: { display: "none" },
    });
    return () => {
      parent?.setOptions({ tabBarStyle: undefined });
    };
  });

  const [city, setCity] = useState(defaultAddress?.city || "");
  const [district, setDistrict] = useState(defaultAddress?.district || "");
  const [village, setVillage] = useState(defaultAddress?.village || "");
  const [street, setStreet] = useState(defaultAddress?.street || "");

  const composedAddress = useMemo(() => {
    if (defaultAddress) {
      return defaultAddress.fullAddress;
    }
    const parts = [city, district, village, street].filter(Boolean);
    return parts.length ? parts.join(", ") : "Адрес не указан";
  }, [defaultAddress, city, district, village, street]);

  const isFormValid = useMemo(() => {
    return [city, district, village, street].some(
      (field) => field.trim().length > 0
    );
  }, [city, district, village, street]);

  const handleSave = async () => {
    if (!isFormValid) return;

    const addressData = { city, district, village, street };

    try {
      if (defaultAddress) {
        await updateAddress(defaultAddress.id!, addressData);
        Toast.success("Адрес обновлен!");
      } else {
        await addAddress(addressData);
        Toast.success("Адрес сохранен!");
      }

      router.back();
    } catch (error) {
      Toast.error("Ошибка при сохранении адреса");
      console.error(error);
    }
  };

  const handleClear = () => {
    setCity("");
    setDistrict("");
    setVillage("");
    setStreet("");
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
            Мой адрес
          </ThemedText>
        </View>
        <View style={{ width: 40 }} />
      </ThemedView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
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
              {/* Current Address Card */}
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
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: adaptiveColor("#fef2f2", "#312e2e"),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="location"
                      size={20}
                      color={adaptiveColor("#dc2626", "#ef4444")}
                    />
                  </View>
                  <ThemedText
                    type="defaultSemiBold"
                    style={{
                      fontSize: 18,
                      color: adaptiveColor("#111827", "#f8fafc"),
                    }}
                  >
                    Текущий адрес
                  </ThemedText>
                </View>
                <ThemedText
                  style={{
                    fontSize: 16,
                    lineHeight: 24,
                    color:
                      composedAddress === "Адрес не указан"
                        ? adaptiveColor("#9ca3af", "#6b7280")
                        : adaptiveColor("#374151", "#d1d5db"),
                    fontStyle:
                      composedAddress === "Адрес не указан"
                        ? "italic"
                        : "normal",
                  }}
                >
                  {composedAddress}
                </ThemedText>
              </View>

              {/* Form Fields */}
              <View style={{ gap: 20 }}>
                <View>
                  <ThemedText
                    type="defaultSemiBold"
                    style={{
                      fontSize: 18,
                      marginBottom: 16,
                      color: adaptiveColor("#111827", "#f8fafc"),
                    }}
                  >
                    Введите адрес
                  </ThemedText>

                  <View style={{ gap: 16 }}>
                    <InputField
                      label="Город"
                      placeholder="Например: Бишкек"
                      value={city}
                      onChangeText={setCity}
                      icon="business"
                      adaptiveColor={adaptiveColor}
                    />

                    <InputField
                      label="Район"
                      placeholder="Например: Ленинский район"
                      value={district}
                      onChangeText={setDistrict}
                      icon="map"
                      adaptiveColor={adaptiveColor}
                    />

                    <InputField
                      label="Село"
                      placeholder="Например: Арча-Бешик"
                      value={village}
                      onChangeText={setVillage}
                      icon="leaf"
                      adaptiveColor={adaptiveColor}
                    />

                    <InputField
                      label="Улица"
                      placeholder="Например: ул. Чуй, д. 123"
                      value={street}
                      onChangeText={setStreet}
                      icon="home"
                      adaptiveColor={adaptiveColor}
                    />
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={{ gap: 12, marginTop: 8 }}>
                <Pressable
                  onPress={handleSave}
                  disabled={!isFormValid}
                  style={({ pressed }) => [
                    {
                      backgroundColor: !isFormValid
                        ? adaptiveColor("#d1d5db", "#4b5563")
                        : pressed
                        ? adaptiveColor("#b91c1c", "#dc2626")
                        : adaptiveColor("#dc2626", "#ef4444"),
                      paddingVertical: 16,
                      borderRadius: 14,
                      alignItems: "center",
                      shadowColor: isFormValid
                        ? adaptiveColor("#dc2626", "#ef4444")
                        : "transparent",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: isFormValid ? 0.2 : 0,
                      shadowRadius: 8,
                      elevation: isFormValid ? 4 : 0,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#ffffff"
                    />
                    <ThemedText
                      style={{
                        color: "#ffffff",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      Сохранить адрес
                    </ThemedText>
                  </View>
                </Pressable>

                {isFormValid && (
                  <Pressable
                    onPress={handleClear}
                    style={({ pressed }) => [
                      {
                        backgroundColor: "transparent",
                        borderWidth: 2,
                        borderColor: adaptiveColor("#e5e7eb", "#374151"),
                        paddingVertical: 14,
                        borderRadius: 14,
                        alignItems: "center",
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons
                        name="refresh"
                        size={18}
                        color={adaptiveColor("#6b7280", "#9ca3af")}
                      />
                      <ThemedText
                        style={{
                          color: adaptiveColor("#6b7280", "#9ca3af"),
                          fontSize: 16,
                          fontWeight: "500",
                        }}
                      >
                        Очистить форму
                      </ThemedText>
                    </View>
                  </Pressable>
                )}
              </View>
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
