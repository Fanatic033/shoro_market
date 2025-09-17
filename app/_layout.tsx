import { Ionicons } from "@expo/vector-icons"
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { Platform, useColorScheme } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import ToastManager from "toastify-react-native/components/ToastManager"

import { useProfile } from "@/services/useProfile"
import { useAuthStore } from "@/store/authStore"
import { useCartStore } from "@/store/cartStore"
import { useOnBoardingStore } from "@/store/onBoardingStore"

export const unstable_settings = { initialRouteName: "(auth)" }

void SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient() 



export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [authHydrated, setAuthHydrated] = useState(false)
  const [onboardingHydrated, setOnboardingHydrated] = useState(false)
  const [cartHydrated, setCartHydrated] = useState(false)

  // Keep user profile in sync globally once tokens are available
  useProfile()

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...Ionicons.font,
  })

  useEffect(() => {
    // subscribe to rehydration of persisted stores so we render only after they are ready
    const unsubAuth = useAuthStore.persist.onFinishHydration(() => {
      setAuthHydrated(true)
    })
    const unsubOnboarding = useOnBoardingStore.persist.onFinishHydration(() => {
      setOnboardingHydrated(true)
    })
    const unsubCart = useCartStore.persist.onFinishHydration(() => {
      setCartHydrated(true)
    })

    // also account for the case when hydration already finished before subscription
    if (useAuthStore.persist.hasHydrated()) setAuthHydrated(true)
    if (useOnBoardingStore.persist.hasHydrated()) setOnboardingHydrated(true)
    if (useCartStore.persist.hasHydrated()) setCartHydrated(true)

    return () => {
      unsubAuth?.()
      unsubOnboarding?.()
      unsubCart?.()
    }
  }, [])

  const storesHydrated =  onboardingHydrated && authHydrated   && cartHydrated

  useEffect(() => {
    if (loaded && storesHydrated) {
      SplashScreen.hideAsync()
    }
  }, [loaded, storesHydrated])

  if (!loaded || !storesHydrated) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
            {Platform.OS !== "web" && <ToastManager position="bottom" />}
        </GestureHandlerRootView>
          </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
