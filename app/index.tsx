import { useAuthStore } from "@/store";
import { useOnBoardingStore } from "@/store/onBoardingStore";
import { Redirect } from "expo-router";

export default function Index() {
  const { hasSeenOnBoarding } = useOnBoardingStore();
  const { user } = useAuthStore();

  if (!hasSeenOnBoarding) {
    return <Redirect href="/onboarding" />;
  }

  // Если пользователь не авторизован
  if (!user) {
    return <Redirect href="/(auth)/login" />;

  }

  // Если пользователь авторизован
  return <Redirect href="/(tabs)/home" />;

}