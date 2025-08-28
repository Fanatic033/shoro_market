import { useAuthStore } from "@/store";
import { Redirect } from "expo-router";

export default function Index() {

  const { user, } = useAuthStore();


  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)/home" />;
}


