import CartBadge from "@/components/Cart/CartBadge";
import { useAuthStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { HapticTab } from "../../components/ui/HapticTab";
import TabBarBackground from "../../components/ui/TabBarBackground";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Colors } from "../../utils/constants/Colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { user, } = useAuthStore();


  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].text,
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: "absolute" },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Главная",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Корзина",
          tabBarIcon: ({ color, size }) => (
            <View style={{ position: "relative" }}>
              <Ionicons name="cart" color={color} size={size} />
              <CartBadge size={18} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="order-history"
        options={{
          title: "Заказы",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bag-check" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
