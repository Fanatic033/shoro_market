import { ThemedText } from "@/components/ui/ThemedText";
import { useLogin } from "@/services/useLogin";
import { useAuthStore } from "@/store/authStore";
import { IUser } from "@/types/user.interface";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const { mutate: login, isPending, error } = useLogin();
  const setUser = useAuthStore((s) => s.setUser);

  const onSubmit = () => {
    if (phoneNumber && password) {
      login(
        { phoneNumber: phoneNumber, password },
        {
          onSuccess: (auth) => {
            const user: IUser = auth as unknown as IUser;
            setUser(user);
            Toast.success("Вы успешно вошли в аккаунт!", "bottom");
            router.navigate("/(tabs)/home");
          },
        }
      );
    }
  };

  const handlePhoneChange = (text: string) => {
    const digitsOnly = text.replace(/\D/g, ""); // оставляем только цифры

    if (digitsOnly === "") {
      setPhoneNumber("0");
      return;
    }

    let formatted = digitsOnly.startsWith("0") ? digitsOnly : "0" + digitsOnly;

    // Максимум 10 цифр (0 + 9)
    if (formatted.length > 10) {
      formatted = formatted.slice(0, 10);
    }

    setPhoneNumber(formatted);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.centerContent}>
              <View style={styles.logoSection}></View>

              {/* Карточка с формой */}
              <View style={styles.card}>
                <ThemedText style={styles.cardTitle}>
                  Войти в аккаунт
                </ThemedText>

                <View style={styles.inputContainer}>
                  <ThemedText style={styles.label}>Номер телефона</ThemedText>
                  <View
                    style={[
                      styles.inputWrapper,
                      error && styles.inputWrapperError,
                    ]}
                  >
                    <Ionicons name="call-outline" size={20} color="#6B7280" />
                    <TextInput
                      style={styles.input}
                      placeholder="0-700123456"
                      autoCapitalize="none"
                      value={phoneNumber}
                      onChangeText={handlePhoneChange}
                      placeholderTextColor="#9CA3AF"
                      editable={!isPending}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <ThemedText style={styles.label}>Пароль</ThemedText>
                  <View
                    style={[
                      styles.inputWrapper,
                      error && styles.inputWrapperError,
                    ]}
                  >
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
                      editable={!isPending}
                    />
                    <Pressable
                      onPress={toggleShowPassword}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#6B7280"
                      />
                    </Pressable>
                  </View>
                  <View style={styles.linkContainer2}>
                    <Link href="/(auth)/forgot-password" style={styles.link}>
                      Забыли пароль ?
                    </Link>
                  </View>
                </View>

                <Pressable
                  style={[styles.button, isPending && styles.buttonDisabled]}
                  onPress={onSubmit}
                  disabled={isPending}
                >
                  <View style={styles.buttonContent}>
                    <ThemedText style={styles.buttonText}>
                      {isPending ? "Вход..." : "Войти"}
                    </ThemedText>
                  </View>
                </Pressable>

                {error && (
                  <ThemedText style={styles.errorText}>
                    {error.message}
                  </ThemedText>
                )}
{/* 
<View style={{ marginVertical: 16 }}>
  <GoogleSignInButton />
</View> */}

                <View style={styles.linkContainer}>
                  <ThemedText style={styles.linkText}>Нет аккаунта?</ThemedText>
                  <Link href="/(auth)/register" style={styles.link}>
                    Зарегистрироваться
                  </Link>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
  inputWrapperError: {
    borderColor: "#DC2626",
    borderWidth: 2,
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
  errorText: {
    color: "#DC2626",
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 4,
  },
  linkContainer2: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
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
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  orText: {
    marginHorizontal: 12,
    color: "#6B7280",
    fontSize: 14,
  },
});
