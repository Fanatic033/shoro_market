import { ThemedText } from "@/components/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = () => {
    if (!phone || !password || password !== confirm) return;
    router.replace("/(tabs)/home");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView style={styles.card}>
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
          placeholderTextColor={"gray"}
        />

        <ThemedText style={styles.label}>Телефон</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="0700123456"
          keyboardType="phone-pad"
          autoCapitalize="none"
          value={phone}
          onChangeText={setPhone}
          placeholderTextColor={"gray"}
        />

        {/* Пароль */}
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
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconWrapper}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#777"
            />
          </Pressable>
        </View>

        {/* Повтор пароля */}
        <ThemedText style={styles.label}>Повторите пароль</ThemedText>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Повторите пароль"
            secureTextEntry={!showConfirm}
            value={confirm}
            onChangeText={setConfirm}
            placeholderTextColor="gray"
          />
          <Pressable
            onPress={() => setShowConfirm(!showConfirm)}
            style={styles.iconWrapper}
          >
            <Ionicons
              name={showConfirm ? "eye-off" : "eye"}
              size={22}
              color="#777"
            />
          </Pressable>
        </View>
        

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
