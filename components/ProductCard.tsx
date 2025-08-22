import { ThemedText } from "@/components/ui/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useCartStore } from "@/store";
import { Colors } from "@/utils/constants/Colors";
import { Image } from "expo-image";
import React from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  item: any;
  isDark: boolean;
  getControlWidth: (id: number) => Animated.Value;
  addToCart: (product: any) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  CARD_WIDTH: number;
};

const ProductCard = ({
  item,
  isDark,
  getControlWidth,
  addToCart,
  increaseQty,
  decreaseQty,
  CARD_WIDTH,
}: Props) => {
  const { isInCart, getItemQuantity } = useCartStore();
  const scheme = useColorScheme() ?? "light";

  return (
    <View
      style={[
        styles.card,
        {
          width: CARD_WIDTH,
          backgroundColor: isDark ? "#1f2937" : "#FFFFFF",
          borderColor: isDark ? "#334155" : "#F0F0F0",
        },
      ]}
    >
      {/* Бейджи */}
      <View style={styles.badges}>
        {item.isNew && (
          <View style={[styles.badge, styles.newBadge]}>
            <ThemedText style={styles.badgeText}>NEW</ThemedText>
          </View>
        )}
        {item.discount && (
          <View style={[styles.badge, styles.discountBadge]}>
            <ThemedText style={styles.badgeText}>-{item.discount}%</ThemedText>
          </View>
        )}
      </View>

      <Image source={item.image} style={styles.image} />

      <View style={styles.productInfo}>
        <ThemedText style={[styles.title, { color: Colors[scheme].text }]}>
          {item.title}
        </ThemedText>

        <View style={styles.priceContainer}>
          <ThemedText style={styles.price}>{item.price} с</ThemedText>
          {item.originalPrice && (
            <ThemedText style={styles.originalPrice}>
              {item.originalPrice} с
            </ThemedText>
          )}
        </View>
      </View>

      {/* Контролы */}
      <View style={styles.qtyContainer}>
        <Animated.View
          style={[styles.controlWrapper, { width: getControlWidth(item.id) }]}
        >
          {isInCart(item.id) ? (
            <View
              style={[
                styles.qtyControl,
                {
                  backgroundColor: isDark ? "#111827" : "#F8F8F8",
                  borderColor: isDark ? "#374151" : "#E0E0E0",
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => decreaseQty(item.id)}
                style={styles.qtyBtnContainer}
              >
                <ThemedText style={styles.qtyBtn}>-</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.qtyCount}>
                {getItemQuantity(item.id)}
              </ThemedText>
              <TouchableOpacity
                onPress={() => increaseQty(item.id)}
                style={styles.qtyBtnContainer}
              >
                <ThemedText style={styles.qtyBtn}>+</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addToCart(item)}
            >
              <ThemedText style={styles.addBtnText}>+</ThemedText>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 12,
    margin: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    position: "relative",
    borderWidth: 1,
  },
  badges: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 2,
    flexDirection: "row",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
  },
  newBadge: { backgroundColor: "#DC143C" },
  discountBadge: { backgroundColor: "#000000" },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
  },
  productInfo: { marginBottom: 12 },
  title: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 16,
  },
  priceContainer: { flexDirection: "row", alignItems: "center" },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#DC143C",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: "#999999",
    textDecorationLine: "line-through",
  },
  qtyContainer: { alignItems: "flex-end" },

  controlWrapper: { overflow: "hidden", borderRadius: 20 },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 4,
    justifyContent: "space-between",
  },
  qtyBtnContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtn: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  qtyCount: { fontSize: 16, fontWeight: "600", textAlign: "center", flex: 1 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    shadowRadius: 6,
  },
  addBtnText: { color: "#fff", fontSize: 20, fontWeight: "600" },
});
