import { Stack } from "expo-router";
import React from "react";

export default function ProfileStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="checkout"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}


