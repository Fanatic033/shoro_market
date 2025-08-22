import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuthStore } from "@/store/authStore";
import { Colors } from "@/utils/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";


export default function ProfileScreen() {
    const router = useRouter()
  const {logout} = useAuthStore()
  const scheme = useColorScheme() ?? 'light'
  const isDark = scheme === 'dark'

  const {user} = useAuthStore()

  // const [user] = useState({
  //   name: "Алиса Иванова",
  //   email: "alisa.ivanova@gmail.com",
  //   phone: "+996 555 123 456",
  //   orders: 24,
  //   level: "Gold Member",
  // });

  

  const [menuItems] = useState([
    { icon: "person", label: "Личные данные", action: "personal_info", badge: null, color: "#4a90e2" },
    { icon: "bag", label: "Мои заказы", action: "orders", badge: "3", color: "#27ae60" },
    { icon: "heart", label: "Избранное", action: "favorites", badge: "12", color: "#e74c3c" },
    { icon: "card", label: "Способы оплаты", action: "payment", badge: null, color: "#f39c12" },
    { icon: "location", label: "Адреса доставки", action: "addresses", badge: null, color: "#9b59b6" },
    { icon: "notifications", label: "Уведомления", action: "notifications", badge: null, color: "#16a085" },
    { icon: "help-circle", label: "Поддержка", action: "support", badge: null, color: "#34495e" },
    { icon: "settings", label: "Настройки", action: "settings", badge: null, color: "#95a5a6" },
  ]);

  

  const handleMenuClick = (action: string) => {
    console.log("Нажато:", action);
  };

  const handleLogout = () => {
    logout()
    router.replace("/(auth)/login");
    console.log("Выход из аккаунта");
  };

  const bottomTabOverflow = useBottomTabOverflow();

  return (
    <View style={[styles.container, { backgroundColor: Colors[scheme].background }]}>
      <LinearGradient
        colors={['#FF0000', '#9e1b32']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView>
         
          <View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.username}</Text>              
              {/* <View style={styles.contactInfo}>
                <View style={styles.contactRow}>
                  <Ionicons name="mail" size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.contactText}>{user.email}</Text>
                </View>
                <View style={styles.contactRow}>
                  <Ionicons name="call" size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.contactText}>{user.phone}</Text>
                </View>
              </View> */}
               <View style={styles.contactInfo}>
                <View style={styles.contactRow}>
                  <Ionicons name="mail" size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.contactText}>{user?.role}</Text>
                </View>
                <View style={styles.contactRow}>
                  <Ionicons name="call" size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.contactText}>{user?.phone}</Text>
                </View>
                <View style={styles.contactRow}>
                  <Ionicons name="person" size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.contactText}>{user?.id}</Text>
                </View>
              </View>
            </View>
          </View>

     
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        style={[
          styles.scrollContent,
          { backgroundColor: Colors[scheme].background }
        ]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomTabOverflow + 20 }}
      >
       

        {/* Меню */}
        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: Colors[scheme].text }]}>Профиль</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  { backgroundColor: isDark ? '#1f2937' : '#ffffff' }
                ]}
                onPress={() => handleMenuClick(item.action)}
              >
                <View style={styles.menuItemContent}>
                  <View style={[styles.menuIconContainer, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon as any} size={22} color="white" />
                  </View>
                  <Text style={[styles.menuLabel, { color: Colors[scheme].text }]}>{item.label}</Text>
                  {item.badge && (
                    <View style={styles.menuBadge}>
                      <Text style={styles.menuBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={20} color={isDark ? '#94a3b8' : '#cbd5e1'} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Кнопка выхода */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={['#fee2e2', '#fecaca']}
            style={styles.logoutGradient}
          >
            <Ionicons name="log-out" size={20} color="#dc2626" />
            <Text style={styles.logoutText}>Выйти из аккаунта</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  
  // Header styles
  headerGradient: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    alignItems: "center",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 24,
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 4,
    textAlign: "center",
  },
  contactInfo: {
    alignItems: "center",
    gap: 8,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "500",
  },

  // Stats styles
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    marginHorizontal: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 16,
  },

  // Content styles
  scrollContent: {
    flex: 1,
    marginTop: -15,
    backgroundColor: "#f1f5f9",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  // Section styles
  section: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
  },
 
  // Menu styles
  menuSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  menuGrid: {
    marginTop: 16,
  },
  menuItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  menuBadge: {
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: "center",
  },
  menuBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },

  // Logout button styles
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 32,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "600",
  },
});