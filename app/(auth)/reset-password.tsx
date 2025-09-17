import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Toast } from "toastify-react-native";

import { ThemedText } from "@/components/ui/ThemedText";
import { useResetPassword } from "@/services/useResetPassword";
import { useAuthStore } from "@/store/authStore";

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPasswordMutation = useResetPassword();
  const isPending = resetPasswordMutation.isPending;
  const { restoreToken, clearRestoreToken } = useAuthStore();

  // Проверяем наличие restoreToken при загрузке
  useEffect(() => {
    if (!restoreToken) {
      router.replace("/(auth)/login");
    }
  }, [restoreToken]);


  const onSubmit = () => {
    if (!restoreToken) {
      Toast.error("Токен восстановления не найден!", "bottom");
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.error("Пароли не совпадают!", "bottom");
      return;
    }

    if (newPassword.length < 6) {
      Toast.error("Пароль должен содержать минимум 6 символов!", "bottom");
      return;
    }

    resetPasswordMutation.mutate(
      { password: newPassword, restoreToken },
      {
        onSuccess: () => {
          Toast.success("Пароль успешно изменён", "bottom");
          clearRestoreToken(); // Очищаем токен после успешного сброса
          router.navigate("/(auth)/login");
        },
        onError: (error) => {
          console.error("ResetPassword: error", error);
        },
      }
    );
  };

  const isFormValid =
    newPassword && confirmPassword && newPassword === confirmPassword && newPassword.length >= 6;

  // Если нет restoreToken, не показываем форму
  if (!restoreToken) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.centerContent}>
            <View style={styles.card}>
              <ThemedText style={styles.cardTitle}>Новый пароль</ThemedText>
              <ThemedText style={styles.description}>
                Придумайте новый пароль для вашего аккаунта
              </ThemedText>

              {/* Новый пароль */}
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Новый пароль</ThemedText>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Введите новый пароль"
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholderTextColor="#9CA3AF"
                    editable={!isPending}
                  />
                  <Pressable onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showNewPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
                  </Pressable>
                </View>
              </View>

              {/* Подтверждение */}
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Подтвердите пароль</ThemedText>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Повторите новый пароль"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholderTextColor="#9CA3AF"
                    editable={!isPending}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
                  </Pressable>
                </View>
              </View>

              <Pressable
                style={[styles.button, (!isFormValid || isPending) && styles.buttonDisabled]}
                onPress={onSubmit}
              >
                <ThemedText style={styles.buttonText}>
                  {isPending ? "Изменение..." : "Изменить пароль"}
                </ThemedText>
              </Pressable>

              <View style={styles.linkContainer}>
                <ThemedText style={styles.linkText}>Вспомнили пароль?</ThemedText>
                <Link href="/(auth)/login" style={styles.link}>
                  Войти
                </Link>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e53935" },
  keyboardView: { flex: 1 },
  content: { flex: 1, padding: 12 },
  centerContent: { flex: 1, justifyContent: "center" },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  cardTitle: { fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 16, textAlign: "center" },
  description: { fontSize: 16, color: "#6B7280", textAlign: "center", marginBottom: 24 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 8 },
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
  input: { flex: 1, marginLeft: 12, color: "#111827", fontSize: 16 },
  eyeIcon: { padding: 4 },
  button: { backgroundColor: "#e53935", borderRadius: 12, paddingVertical: 16, marginTop: 8, marginBottom: 16 },
  buttonDisabled: { backgroundColor: "#9CA3AF" },
  buttonText: { color: "white", fontWeight: "600", fontSize: 18, textAlign: "center" },
  linkContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 },
  linkText: { fontSize: 14, color: "#6B7280" },
  link: { color: "#e53935", fontWeight: "600", fontSize: 14 },
});
