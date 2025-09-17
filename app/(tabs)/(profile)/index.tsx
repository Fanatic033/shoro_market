import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"
import { Toast } from "toastify-react-native"

import { useBottomTabOverflow } from "@/components/ui/TabBarBackground"
import { useAppTheme } from "@/hooks/useAppTheme"
import { useProfile } from "@/services/useProfile"
import { useAuthStore } from "@/store"
import axiosApi from "@/utils/instance"

export default function ProfileScreen() {
  const router = useRouter()
  const { user } = useProfile()
  const { logout } = useAuthStore()
  const { adaptiveColor } = useAppTheme()
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false);
const [newEmail, setNewEmail] = useState("");
const [emailError, setEmailError] = useState<string | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);
const updateEmail = async () => {
  if (!user?.id) {
    Toast.error("Пользователь не найден");
    return;
  }

  // Валидация email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newEmail)) {
    setEmailError("Введите корректный email");
    return;
  }

  setIsSubmitting(true);
  setEmailError(null);

  try {
    const response = await axiosApi.patch(`/users/${user.id}`, {
      email: newEmail,
    });

    if (response.status === 200) {
      Toast.success("Email успешно обновлен!");
      setShowEmailModal(false);
      setNewEmail("");
      
      // Обновляем профиль — чтобы useProfile подтянул новые данные
      const updatedUser = {
        ...user,
        email: newEmail,
      };
      useAuthStore.getState().setUser(updatedUser);
    }
  } catch (error) {
    console.error("Ошибка обновления email:", error);
    Toast.error("Не удалось обновить email");
  } finally {
    setIsSubmitting(false);
  }
};

  const scrollY = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })
  

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100, 150], [0, 0, 1], Extrapolate.CLAMP)

    return {
      opacity,
    }
  })

  const [menuItems] = useState([
    { icon: "person-outline", label: "Личные данные", action: "personal_info", badge: null, color: "#DC143C" },
    // { icon: "bag-outline", label: "Мои заказы", action: "orders", badge: "3", color: "#000000" },
    { icon: "location-outline", label: "Адреса доставки", action: "addresses", badge: null, color: "#DC143C" },
    { icon: "notifications-outline", label: "Уведомления", action: "notifications", badge: null, color: "#000000" },
    { icon: "help-circle-outline", label: "Поддержка", action: "support", badge: null, color: "#DC143C" },
    // { icon: "settings-outline", label: "Настройки", action: "settings", badge: null, color: "#000000" },
  ])

  const handleMenuClick = (action: string) => {
    if (action === "addresses") {
      router.push("/(tabs)/(profile)/addresses")
      return
    }
   
    console.log("Нажато:", action)
  }
  const handleLogout = async () => {
    try {
      setLogoutLoading(true)
      await logout()
      router.replace("/(auth)/login")
    } catch (e) {
      console.error("Ошибка выхода:", e)
    } finally {
      setLogoutLoading(false)
    }
  }

  const bottomTabOverflow = useBottomTabOverflow()

  return (
    <View style={[styles.container, { backgroundColor: adaptiveColor("#ffffff", "#111827") }]}>
      <Animated.View
        style={[
          styles.animatedHeader,
          {
            backgroundColor: adaptiveColor("#e5e7eb", "#111827"),
            borderBottomColor: adaptiveColor("#e5e7eb", "#ff0f0"),
          },
          headerAnimatedStyle,
        ]}
      >
        <View style={styles.headerContent}> 
          <Text style={[styles.headerName, { color: adaptiveColor("#374151", "#f9fafb") }]}>
            {user?.name || "Пользователь"} 
          </Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={[styles.scrollContent, { backgroundColor: adaptiveColor("#ffffff", "#111827") }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomTabOverflow + 20, paddingTop: 60 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={styles.userCard}>
          <View style={[styles.userCardContent, { backgroundColor: adaptiveColor("#f8fafc", "#1f2937") }]}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || "U"}</Text>
              </View>
            </View>

            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: adaptiveColor("#374151", "#f9fafb") }]}>{user?.name || 'Пользователь'}</Text>

              <View style={styles.userMeta}>
              <View style={styles.metaItem}>
                  <Ionicons name="mail-outline" size={14} color="#6b7280" />
                  <Text style={[styles.metaText, { color: "#6b7280" }]}>{user?.email}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="call-outline" size={14} color="#6b7280" />
                  <Text style={[styles.metaText, { color: "#6b7280" }]}>{user?.phoneNumber || "Не указан"}</Text>
                </View>
               
              </View>
            </View>
          </View>
        </View>
        {!user?.email && (
  <TouchableOpacity
    style={{
      backgroundColor: adaptiveColor("#fef2f2", "#451a1a"),
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
      borderWidth: 1,
      borderColor: adaptiveColor("#fecaca", "#7f1d1d"),
    }}
    onPress={() => setShowEmailModal(true)}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Ionicons name="alert-circle" size={20} color={adaptiveColor("#dc2626", "#fca5a5")} />
      <Text style={{
        color: adaptiveColor("#dc2626", "#fca5a5"),
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
      }}>
        Привяжите email для безопасности и восстановления пароля
      </Text>
      <Ionicons name="chevron-forward" size={18} color={adaptiveColor("#dc2626", "#fca5a5")} />
    </View>
  </TouchableOpacity>
)}

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
        <TouchableOpacity
          style={[styles.logoutButton, logoutLoading && { opacity: 0.6 }]}
          onPress={handleLogout}
          activeOpacity={0.8}
          disabled={logoutLoading}
        >
          <View style={styles.logoutContent}>
            {logoutLoading ? (
              <ActivityIndicator size="small" color="#dc2626" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={20} color="#dc2626" />
                <Text style={styles.logoutText}>Выйти из аккаунта</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: "#6b7280" }]}>Версия приложения 1.0.0</Text>
        </View>
      </Animated.ScrollView>
      {/* Email Modal */}
{showEmailModal && (
  <View style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  }}>
    <View style={{
      width: '90%',
      maxWidth: 400,
      backgroundColor: adaptiveColor("#ffffff", "#1f2937"),
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '600',
        color: adaptiveColor("#111827", "#f9fafb"),
        marginBottom: 16,
        textAlign: 'center',
      }}>
        Привязать email
      </Text>

      <TextInput
        placeholder="Введите ваш email"
        placeholderTextColor={adaptiveColor("#9ca3af", "#6b7280")}
        value={newEmail}
        onChangeText={(text) => {
          setNewEmail(text);
          setEmailError(null);
        }}
        autoCorrect={false}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          borderWidth: 2,
          borderColor: emailError ? adaptiveColor("#ef4444", "#f87171") : adaptiveColor("#e5e7eb", "#374151"),
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          fontSize: 16,
          backgroundColor: adaptiveColor("#fafafa", "#111827"),
          color: adaptiveColor("#111827", "#f9fafb"),
          marginBottom: 12,
        }}
      />

      {emailError && (
        <Text style={{
          color: adaptiveColor("#ef4444", "#f87171"),
          fontSize: 14,
          marginBottom: 12,
        }}>
          {emailError}
        </Text>
      )}

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        <Pressable
          onPress={() => setShowEmailModal(false)}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: adaptiveColor("#e5e7eb", "#374151"),
            alignItems: 'center',
          }}
        >
          <Text style={{
            color: adaptiveColor("#374151", "#e5e7eb"),
            fontSize: 16,
            fontWeight: '600',
          }}>
            Отмена
          </Text>
        </Pressable>

        <Pressable
          onPress={updateEmail}
          disabled={isSubmitting}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: isSubmitting ? adaptiveColor("#991b1b", "#b91c1c") : adaptiveColor("#dc2626", "#ef4444"),
            alignItems: 'center',
            opacity: isSubmitting ? 0.8 : 1,
          }}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={{
              color: "#ffffff",
              fontSize: 16,
              fontWeight: '600',
            }}>
              Сохранить
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  </View>
)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1000,
    borderBottomWidth: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    gap: 12,
  },
  headerEmail: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  headerEmailText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
  headerName: {
    fontSize: 22,
    fontWeight: "600",
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
    shadowOpacity: 0.3,
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
    gap: 8,
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
    gap: 10,
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
