import { ThemedText } from "@/components/ui/ThemedText";
import { useVerifyCode } from "@/services/useVerifyCode";
import { useAuthStore } from "@/store/authStore";
import axiosApi from "@/utils/instance";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

export default function VerifyCodeScreen() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isPending, setIsPending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRefs = useRef<TextInput[]>([]);
  const { email, phoneNumber } = useLocalSearchParams<{ email?: string; phoneNumber?: string }>();
  const verifyCodeMutation = useVerifyCode();
  const { setRestoreToken } = useAuthStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    if (errorMessage) setErrorMessage(null);
    // Если система подставила весь код (iOS/Android автозаполнение)
    if (text.length > 1) {
      const digits = text.replace(/\D/g, "").slice(0, 6).split("");
      const filled = Array.from({ length: 6 }, (_, i) => digits[i] || "");
      setCode(filled);
      // Фокус на последний заполненный инпут
      const lastIndex = Math.min(digits.length - 1, 5);
      if (lastIndex >= 0) {
        inputRefs.current[lastIndex]?.focus();
      }
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Автоматический переход к следующему полю
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Переход к предыдущему полю при удалении
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resendCode = async () => {
    if (timer > 0 || isResending) return;

    if (!email && !phoneNumber) {
      Toast.error("Неизвестен email или номер телефона для повторной отправки", "bottom");
      return;
    }

    try {
      setIsResending(true);
      const queryParams = new URLSearchParams();
      if (email) queryParams.append("email", email);
      if (phoneNumber) queryParams.append("phoneNumber", phoneNumber);

      await axiosApi.post(`/auth/password/restore?${queryParams.toString()}`);

      // Очистить поля и вернуть фокус на первый инпут
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      setTimer(60);
      Toast.success("Код отправлен повторно!", "bottom");
    } catch (error: any) {
      const message = error?.message || "Ошибка при повторной отправке кода";
      Toast.error(message, "bottom");
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async () => {
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      setIsPending(true);
      setErrorMessage(null);
      
      try {
        const params: any = { code: parseInt(fullCode) };
        if (email) params.email = email;
        if (phoneNumber) params.phoneNumber = phoneNumber;
        
          
        const result: any = await verifyCodeMutation.mutateAsync(params);
        
        // Сохраняем restoreToken для использования при смене пароля
        const restoreToken = result?.restoreToken;
        if (restoreToken) {
          setRestoreToken(restoreToken);
          
          router.navigate({
            pathname: "/(auth)/reset-password",
          });
        } else {
          setErrorMessage("Ошибка при получении токена восстановления");
        }
        
      } catch (error: any) {
        setErrorMessage(error?.message || "Неверный код. Попробуйте еще раз.");
      } finally {
        setIsPending(false);
      }
    }
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View style={styles.centerContent}>
            <View style={styles.logoSection}>
            </View>

            {/* Карточка с формой */}
            <View style={styles.card}>
              <ThemedText style={styles.cardTitle}>
                Подтверждение кода
              </ThemedText>

              <ThemedText style={styles.description}>
                Введите 6-значный код, отправленный на {email ? `ваш email ${email}` : phoneNumber ? `ваш номер ${phoneNumber}` : 'ваш email или номер телефона'}
              </ThemedText>

              <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      if (ref) inputRefs.current[index] = ref;
                    }}
                    style={[styles.codeInput, errorMessage && styles.codeInputError]}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    editable={!isPending}
                    autoComplete={Platform.select({ ios: "one-time-code", android: "sms-otp" }) as any}
                    textContentType={Platform.OS === "ios" ? "oneTimeCode" : "oneTimeCode"}
                    importantForAutofill="yes"
                    autoCorrect={false}
                    autoCapitalize="none"
                    inputMode="numeric"
                    autoFocus={index === 0}
                  />
                ))}
              </View>

              {errorMessage && (
                <ThemedText style={styles.errorText}>
                  {errorMessage}
                </ThemedText>
              )}

              <Pressable 
                style={[styles.button, (!isCodeComplete || isPending) && styles.buttonDisabled]} 
                onPress={onSubmit} 
                disabled={!isCodeComplete || isPending}
              >
                <View style={styles.buttonContent}>
                  <ThemedText style={styles.buttonText}>
                    {isPending ? "Проверка..." : "Подтвердить"}
                  </ThemedText>
                </View>
              </Pressable>

              <View style={styles.timerContainer}>
                <ThemedText style={styles.timerText}>
                  {timer > 0 ? `Отправить код повторно через ${timer}с` : "Не получили код?"}
                </ThemedText>
                {timer === 0 && (
                  <Pressable onPress={resendCode} style={styles.resendButton} disabled={isResending}>
                    <ThemedText style={styles.resendText}>{isResending ? "Отправка..." : "Отправить повторно"}</ThemedText>
                  </Pressable>
                )}
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
    marginBottom: 32,
    lineHeight: 22,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 8,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  codeInputError: {
    borderColor: "#EF4444",
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
    marginBottom: 24,
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
  timerContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  timerText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 8,
  },
  resendButton: {
    paddingVertical: 4,
  },
  resendText: {
    color: "#e53935",
    fontWeight: "600",
    fontSize: 14,
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
    marginTop: -16,
    marginBottom: 24,
    fontSize: 14,
    fontWeight: "500",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
});
