
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground"
import { useAppTheme } from "@/hooks/useAppTheme"
import { useAuthStore } from "@/store/authStore"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function ProfileScreen() {
  const router = useRouter()
  const { logout } = useAuthStore()
  const { isDark, adaptiveColor } = useAppTheme()

  const { user } = useAuthStore()

  const [menuItems] = useState([
    { icon: "person-outline", label: "Личные данные", action: "personal_info", badge: null, color: "#DC143C" },
    { icon: "bag-outline", label: "Мои заказы", action: "orders", badge: "3", color: "#000000" },
    { icon: "location-outline", label: "Адреса доставки", action: "addresses", badge: null, color: "#DC143C" },
    { icon: "notifications-outline", label: "Уведомления", action: "notifications", badge: null, color: "#000000" },
    { icon: "help-circle-outline", label: "Поддержка", action: "support", badge: null, color: "#DC143C" },
    { icon: "settings-outline", label: "Настройки", action: "settings", badge: null, color: "#000000" },
  ])

  const handleMenuClick = (action: string) => {
    console.log("Нажато:", action)
  }

  const handleLogout = () => {
    logout()
    router.replace("/(auth)/login")
    console.log("Выход из аккаунта")
  }

  const bottomTabOverflow = useBottomTabOverflow()

  return (
    <View style={[styles.container, { backgroundColor: adaptiveColor("#ffffff", "#111827") }]}>
      <ScrollView
        style={[styles.scrollContent, { backgroundColor: adaptiveColor("#ffffff", "#111827") }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomTabOverflow + 20, paddingTop: 60 }}
      >
        <View style={styles.userCard}>
          <View style={[styles.userCardContent, { backgroundColor: adaptiveColor("#f8fafc", "#1f2937") }]}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.username?.charAt(0).toUpperCase() || "U"}</Text>
              </View>
            </View>

            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: adaptiveColor("#374151", "#f9fafb") }]}>{user?.username}</Text>
              <Text style={[styles.userRole, { color: "#6b7280" }]}>{user?.role}</Text>

              <View style={styles.userMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="call-outline" size={14} color="#6b7280" />
                  <Text style={[styles.metaText, { color: "#6b7280" }]}>{user?.phone || "Не указан"}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="person-outline" size={14} color="#6b7280" />
                  <Text style={[styles.metaText, { color: "#6b7280" }]}>ID: {user?.id}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: adaptiveColor("#374151", "#f9fafb") }]}>Меню</Text>

          <View style={styles.menuList}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { backgroundColor: adaptiveColor("#f8fafc", "#1f2937") }]}
                onPress={() => handleMenuClick(item.action)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <View style={[styles.menuIconContainer, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon as any} size={20} color="white" />
                  </View>

                  <View style={styles.menuTextContainer}>
                    <Text style={[styles.menuLabel, { color: adaptiveColor("#374151", "#f9fafb") }]}>{item.label}</Text>
                  </View>

                  <View style={styles.menuRight}>
                    {item.badge && (
                      <View style={styles.menuBadge}>
                        <Text style={styles.menuBadgeText}>{item.badge}</Text>
                      </View>
                    )}
                    <Ionicons name="chevron-forward" size={18} color="#6b7280" style={styles.chevron} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <View style={styles.logoutContent}>
              <Ionicons name="log-out-outline" size={20} color="#dc2626" />
              <Text style={styles.logoutText}>Выйти из аккаунта</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: "#6b7280" }]}>Версия приложения 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  userCard: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  userCardContent: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
  },
  userDetails: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  userRole: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
    textTransform: "capitalize",
  },
  userMeta: {
    gap: 8,
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: "500",
  },

  menuSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  menuList: {
    gap: 8,
  },
  menuItem: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuBadge: {
    backgroundColor: "#dc2626",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 20,
    alignItems: "center",
  },
  menuBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  chevron: {
    marginLeft: 4,
  },

  logoutSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  logoutButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dc2626",
    backgroundColor: "transparent",
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "600",
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    fontWeight: "500",
  },
})
