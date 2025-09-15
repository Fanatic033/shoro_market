import { ThemedText } from "@/components/ui/ThemedText";
import { useSafeArea } from "@/hooks/useSafeArea";
import { useRegister } from "@/services/useRegister";
import { useAuthStore } from "@/store/authStore"; // <-- Добавлено
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  // const [username, setUsername] = useState(""); // <-- Добавлено
  // const [email, setEmail] = useState(""); // <-- Добавлено
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuthStore();
  const registerMutation = useRegister();

  const safeArea = useSafeArea();

  const onSubmit = async () => {
    // Валидация
    if (
      // !username.trim() ||
      // !email.trim() ||
      !phone.trim() ||
      !name.trim() ||
      !password.trim()
    ) {
      Alert.alert("Ошибка", "Пожалуйста, заполните все поля");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Ошибка", "Пароли не совпадают");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Ошибка", "Пароль должен быть не менее 8 символов");
      return;
    }

    setIsLoading(true);

    try {
      const data = await registerMutation.mutateAsync({
        // username,
        // email,
        password,
        name,
        phoneNumber: phone,
        // address 
      });

      // Сохраняем пользователя и токены
      setUser({
        id: data.id,
        name: data.name,
        phoneNumber: data.phoneNumber,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      Alert.alert("Успех", "Регистрация прошла успешно!");
      router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert(
        "Ошибка регистрации",
        error.message || "Не удалось зарегистрироваться"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: safeArea.getTopPadding() }]}
    >
      <ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.centerContent}>
            <View style={styles.card}>
              <ThemedText style={styles.cardTitle}>Создать аккаунт</ThemedText>

              {/* Username */}
              {/* <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Логин (username)*</ThemedText>
                <View style={styles.inputWrapper}>
                  <Ionicons name="at-outline" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="ivan_2025"
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View> */}

              {/* Email */}
              {/* <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Email*</ThemedText>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="ivan@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View> */}
              
              {/* Phone */}
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Телефон*</ThemedText>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="0700123456"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    value={phone}
                    onChangeText={setPhone}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Name */}
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Имя*</ThemedText>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Иван Петров"
                    autoCapitalize="words"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              

              {/* Password */}
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Пароль*</ThemedText>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#6B7280"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Введите пароль"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#9CA3AF"
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#6B7280"
                    />
                  </Pressable>
                </View>
                <ThemedText style={styles.helperText}>
                  Минимум 8 символов
                </ThemedText>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Повторите пароль*</ThemedText>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color="#6B7280"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Повторите пароль"
                    secureTextEntry={!showConfirm}
                    value={confirm}
                    onChangeText={setConfirm}
                    placeholderTextColor="#9CA3AF"
                  />
                  <Pressable
                    onPress={() => setShowConfirm(!showConfirm)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showConfirm ? "eye-off" : "eye"}
                      size={20}
                      color="#6B7280"
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={onSubmit}
                disabled={isLoading}
              >
                <View style={styles.buttonContent}>
                  <ThemedText style={styles.buttonText}>
                    {isLoading ? "Регистрация..." : "Создать аккаунт"}
                  </ThemedText>
                </View>
              </Pressable>
              {registerMutation.error && (
                <ThemedText style={styles.errorText}>
                  {registerMutation.error.message}
                </ThemedText>
              )}


              <View style={styles.linkContainer}>
                <ThemedText style={styles.linkText}>
                  Уже есть аккаунт?
                </ThemedText>
                <Link href="/(auth)/login" style={styles.link}>
                  Войти
                </Link>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e53935",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    marginLeft: 12,
    color: "#111827",
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#e53935",
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
    marginLeft: 8,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 4,
  },
  linkText: {
    fontSize: 14,
    color: "#6B7280",
  },
  link: {
    color: "#e53935",
    fontWeight: "600",
    fontSize: 14,
  },
  errorText: {
    color: "#DC2626",
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
  },
});
