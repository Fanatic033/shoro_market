import { useAuthStore } from "@/store";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { user, } = useAuthStore();

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

 

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="verify-code" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}


