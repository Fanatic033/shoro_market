import { Stack } from "expo-router";

export default function ProfileStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="addresses"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}


