import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import { useThemeColor } from "../../hooks/useThemeColor";

export default function BackButton() {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');

  const handlePress = () => {
    // Prefer going back in history; if not possible, navigate to root
    try {
      // @ts-ignore expo-router provides canGoBack
      if (router.canGoBack?.()) {
        router.back();
      } else {
        router.replace("/");
      }
    } catch {
      router.replace("/");
    }
  };

  return (
    <Pressable 
      onPress={handlePress} 
      hitSlop={12}
      style={({ pressed }) => [
        {
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: pressed ? `${iconColor}15` : 'transparent',
          borderWidth: 1,
          borderColor: pressed ? `${iconColor}30` : borderColor,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        }
      ]}
    >
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: `${backgroundColor}80`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <Ionicons 
          name="chevron-back" 
          size={20} 
          color={iconColor}
          style={{ 
            marginLeft: -1 // Slight optical adjustment for centering
          }}
        />
      </View>
    </Pressable>
  );
}