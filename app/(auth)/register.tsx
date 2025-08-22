import { ThemedText } from "@/components/ui/ThemedText";
import { useAuthStore } from "@/store/authStore";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const login = useAuthStore((s) => s.login);

  const onSubmit = () => {
    if (!phone || !password || password !== confirm) return;
    login(phone); // фейковая регистрация → автологин
    router.replace("/(tabs)/home");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logo}>
        <Image
          source={require("../../assets/images/man.png")}          
          style={styles.logoImage}
        />
      </View>

      {/* Карточка */}
      <View style={styles.card}>
        <ThemedText style={styles.subtext}>
          Создайте аккаунт — это займет меньше минуты
        </ThemedText>


        <ThemedText style={styles.label}>Имя</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Иван Петров"
          keyboardType="default"
          autoCapitalize="none"
          value={name}
          onChangeText={setName}
        />

        <ThemedText style={styles.label}>Телефон</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="0700123456"
          keyboardType="phone-pad"
          autoCapitalize="none"
          value={phone}
          onChangeText={setPhone}
        />

        {/* Пароль */}
        <ThemedText style={styles.label}>Пароль</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Введите пароль"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Повтор пароля */}
        <ThemedText style={styles.label}>Повторите пароль</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Повторите пароль"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        {/* Кнопка */}
        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <ThemedText style={styles.buttonText}>Создать аккаунт</ThemedText>
        </TouchableOpacity>

        {/* Ссылка */}
        <ThemedText style={styles.link}>
          Уже есть аккаунт?{" "}
          <Link href="/(auth)/login" style={styles.linkText}>
            Войти
          </Link>
        </ThemedText>
      </View>
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
    backgroundColor: "#fff",
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
});
