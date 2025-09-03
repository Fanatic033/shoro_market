import { ThemedText } from "@/components/ui/ThemedText";
import { useSafeArea } from "@/hooks/useSafeArea";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View
} from "react-native";

export default function RegisterScreen() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const safeArea = useSafeArea();

  const onSubmit = () => {
    if (!phone || !password || password !== confirm) return;
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: safeArea.getTopPadding() }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.centerContent}>
            {/* Логотип и заголовок */}
            <View style={styles.logoSection}>
            </View>

            {/* Карточка с формой */}
            <View style={styles.card}>
              <ThemedText style={styles.cardTitle}>
                Создать аккаунт
              </ThemedText>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Имя</ThemedText>
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

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Телефон</ThemedText>
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

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Пароль</ThemedText>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Введите пароль"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#9CA3AF"
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#6B7280"
                    />
                  </Pressable>
                </View>
                <ThemedText style={styles.helperText}>Минимум 8 символов</ThemedText>
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Повторите пароль</ThemedText>
                <View style={styles.inputWrapper}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Повторите пароль"
                    secureTextEntry={!showConfirm}
                    value={confirm}
                    onChangeText={setConfirm}
                    placeholderTextColor="#9CA3AF"
                  />
                  <Pressable onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeIcon}>
                    <Ionicons
                      name={showConfirm ? "eye-off" : "eye"}
                      size={20}
                      color="#6B7280"
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable style={styles.button} onPress={onSubmit}>
                <View style={styles.buttonContent}>
                  <ThemedText style={styles.buttonText}>Создать аккаунт</ThemedText>
                </View>
              </Pressable>
{/* 
              <ThemedText style={styles.termsText}>
                Создавая аккаунт, вы соглашаетесь с нашими Условиями использования и Политикой конфиденциальности
              </ThemedText> */}

              <View style={styles.linkContainer}>
                <ThemedText style={styles.linkText}>Уже есть аккаунт?</ThemedText>
                <Link href="/(auth)/login" style={styles.link}>
                  Войти
                </Link>
              </View>
            </View>

            <View style={styles.footer}>
            
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
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 24,
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
    marginBottom: 16,
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
  termsText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 16,
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
    color: "#e5393",
    fontWeight: "600",
    fontSize: 14,
  },
  footer: {
    paddingBottom: 24,
  },
  footerText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
});