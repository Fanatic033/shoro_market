import { ThemedText } from "@/components/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async () => {
    if (!email) return;

    try {
      setIsPending(true);
    //   const res = await axiosApi.post("/auth/password/restore", { email });
    router.navigate("/(auth)/verify-code");
   await axios.post(`http://192.168.8.207:8080/api/auth/password/restore?email=${email}`);

      Toast.success("Код отправлен на вашу почту!", "bottom");
      console.log(email)
    } catch (err: any) {
      console.error("Ошибка при запросе:", err?.response?.data || err.message);
      Toast.error("Ошибка при отправке кода");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.centerContent}>
            <View style={styles.logoSection}></View>

            {/* Карточка с формой */}
            <View style={styles.card}>
              <ThemedText style={styles.cardTitle}>
                Восстановление пароля
              </ThemedText>

              <ThemedText style={styles.description}>
                Введите email, указанный при регистрации. Мы отправим вам код
                для восстановления пароля.
              </ThemedText>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Email</ThemedText>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Введите ваш email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#9CA3AF"
                    editable={!isPending}
                  />
                </View>
              </View>

              <Pressable
                style={[styles.button, isPending && styles.buttonDisabled]}
                onPress={onSubmit}
                disabled={isPending}
              >
                <View style={styles.buttonContent}>
                  <ThemedText style={styles.buttonText}>
                    {isPending ? "Отправка..." : "Отправить код"}
                  </ThemedText>
                </View>
              </Pressable>

            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  logoSection: {
    alignItems: "center",
    marginBottom: 32,
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
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
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
  button: {
    backgroundColor: "#e53935",
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
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
});
