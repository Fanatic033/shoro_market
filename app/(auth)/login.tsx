import { ThemedText } from "@/components/ui/ThemedText";
import { useLogin } from "@/services/useLogin";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Toast } from "toastify-react-native";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
      setShowPassword(!showPassword);
  };
  
  const { mutate: login, isPending, error } = useLogin();
  const setUser = useAuthStore((s) => s.setUser);

  const onSubmit = () => {
    if (username && password) {
      login(
        { username: username, password },
        {
          onSuccess: (user) => {
            setUser(user); 
            Toast.success("Вы успешно вошли в аккаунт!", "bottom")
            router.navigate("/(tabs)/home");
          },
        }
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Логотип */}
      <View style={styles.logo}>
        {/* <Image
          source={require("../../assets/images/man.png")}
          style={styles.logoImage}
        /> */}
      </View>

      <KeyboardAvoidingView style={styles.card}>
        <ThemedText style={styles.subtext}>
          С возвращением — введите свои данные, чтобы продолжить
        </ThemedText>

        <ThemedText style={styles.label}>Имя пользователя</ThemedText>
        <TextInput
  style={styles.input}
  placeholder="Введите имя пользователя"
  autoCapitalize="none"
  value={username}
  onChangeText={setUsername}
  placeholderTextColor={'gray'}
/>
<ThemedText style={styles.label}>Пароль</ThemedText>
<View style={styles.passwordWrapper}>
  <TextInput
    style={styles.inputPassword}
    placeholder="Введите пароль"
    secureTextEntry={!showPassword}
    value={password}
    onChangeText={setPassword}
    placeholderTextColor="gray"
  />

  <Pressable onPress={toggleShowPassword} style={styles.iconWrapper}>
    <Ionicons
      name={showPassword ? "eye-off" : "eye"}
      size={22}
      color="#777"
    />
  </Pressable>
</View>


        <Pressable style={styles.button} onPress={onSubmit} disabled={isPending}>
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Войти</ThemedText>
          )}
        </Pressable>

        {error && (
          <ThemedText style={{ color: "red", textAlign: "center", marginTop: 8 }}>
            Ошибка входа, проверьте данные
          </ThemedText>
        )}

        <ThemedText style={styles.link}>
          Нет аккаунта?{" "}
          <Link href="/(auth)/register" style={styles.linkText}>
            Зарегистрироваться
          </Link>
        </ThemedText>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#e53935",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#e53935",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  logoImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 40,
    elevation: 5,
  },
  subtext: {
    fontSize: 13,
    color: "#546e7a",
    textAlign: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    marginTop: 8,
    color: "#000",
  },
  input: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#e53935",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  link: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
    color: "#000",
  },
  linkText: {
    color: "#e53935",
    fontWeight: "700",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    height: 48,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  inputPassword: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#000",
  },
  iconWrapper: {
    padding: 6,
  },
});
