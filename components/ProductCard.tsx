import { ThemedText } from "@/components/ui/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Product } from "@/services/products";
import { useCartStore } from "@/store";
import { Colors } from "@/utils/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Animated, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

type Props = {
  item: Product;
  isDark: boolean;
  addToCart: (product: Product) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  CARD_WIDTH: number;
};

const ProductCard = ({
  item,
  isDark,
  addToCart,
  increaseQty,
  decreaseQty,
  CARD_WIDTH,
}: Props) => {
  const { isInCart, getItemQuantity } = useCartStore();
  const scheme = useColorScheme() ?? "light";
  // const [infoVisible, setInfoVisible] = React.useState(false);
  const minusScale = React.useRef(new Animated.Value(1)).current;
  const plusScale = React.useRef(new Animated.Value(1)).current;
  const qtyScale = React.useRef(new Animated.Value(1)).current;
  const CONTROL_MIN_WIDTH = 40;
  const CONTROL_MAX_WIDTH = CARD_WIDTH - 20;
  const controlWidth = React.useRef(new Animated.Value(isInCart(item.id) ? CONTROL_MAX_WIDTH : CONTROL_MIN_WIDTH)).current;

  React.useEffect(() => {
    const target = isInCart(item.id) ? CONTROL_MAX_WIDTH : CONTROL_MIN_WIDTH;
    Animated.timing(controlWidth, {
      toValue: target,
      duration: 250,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInCart(item.id)]);

  const formatPrice = (value: number) => {
    if (value === null || value === undefined) return '0';
    const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
    return Number.isInteger(rounded) ? String(rounded) : String(rounded);
  };

  const color = isDark ? 'white' : 'black'

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

      <TouchableWithoutFeedback>
        <Image source={item.image} style={styles.image} transition={300}/>
      </TouchableWithoutFeedback>

      <View style={styles.productInfo}>
        <TouchableOpacity activeOpacity={0.7}>
          <ThemedText
            style={[styles.title, { color: Colors[scheme].text }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.title}
          </ThemedText>
        </TouchableOpacity>

        <View style={styles.priceContainer}>
          <ThemedText style={styles.price}>{formatPrice(item.price)} с</ThemedText>
          {item.originalPrice && (
            <ThemedText style={styles.originalPrice}>
              {formatPrice(item.originalPrice)} с
            </ThemedText>
          )}
        </View>
      </View>

      {/* Контролы */}
      <View style={styles.qtyContainer}>
        <Animated.View style={[styles.controlWrapper, { width: controlWidth }]}>
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
                onPress={() => {
                  Animated.sequence([
                    Animated.timing(minusScale, { toValue: 0.9, duration: 70, useNativeDriver: true }),
                    Animated.spring(minusScale, { toValue: 1, useNativeDriver: true })
                  ]).start();
                  Animated.sequence([
                    Animated.timing(qtyScale, { toValue: 1.08, duration: 80, useNativeDriver: true }),
                    Animated.spring(qtyScale, { toValue: 1, useNativeDriver: true })
                  ]).start();
                  decreaseQty(item.id);
                }}
                style={styles.qtyBtnContainer}
              >
                <Animated.View style={{ transform: [{ scale: minusScale }] }}>
                  {/* <ThemedText style={styles.qtyBtn}>-</ThemedText> */}
                  <Ionicons name="remove-circle-outline" size={35} color={color}/>
                </Animated.View>
              </TouchableOpacity>
              <Animated.View style={{ flex: 1, transform: [{ scale: qtyScale }] }}>
                <ThemedText style={styles.qtyCount}>
                  {getItemQuantity(item.id)}
                </ThemedText>
              </Animated.View>
              <TouchableOpacity
                onPress={() => {
                  Animated.sequence([
                    Animated.timing(plusScale, { toValue: 0.9, duration: 70, useNativeDriver: true }),
                    Animated.spring(plusScale, { toValue: 1, useNativeDriver: true })
                  ]).start();
                  Animated.sequence([
                    Animated.timing(qtyScale, { toValue: 1.08, duration: 80, useNativeDriver: true }),
                    Animated.spring(qtyScale, { toValue: 1, useNativeDriver: true })
                  ]).start();
                  increaseQty(item.id);
                }}
                style={styles.qtyBtnContainer}
              >
                <Animated.View style={{ transform: [{ scale: plusScale }] }}>
                  {/* <ThemedText style={styles.qtyBtn}>+</ThemedText> */}
                  <Ionicons name="add-circle-outline" size={35} color={color}/>
                </Animated.View>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                Animated.sequence([
                  Animated.timing(plusScale, { toValue: 0.9, duration: 70, useNativeDriver: true }),
                  Animated.spring(plusScale, { toValue: 1, useNativeDriver: true })
                ]).start();
                addToCart(item);
              }}
            >
              <Animated.View style={{ transform: [{ scale: plusScale }] }}>
                {/* <ThemedText style={styles.addBtnText}> */}
                  <Ionicons name="add-circle-outline" size={40} color={color}/>
                  {/* </ThemedText> */}
              </Animated.View>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
{/* 
      <Modal
        visible={infoVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setInfoVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setInfoVisible(false)}>
          <Pressable style={[styles.modalCard, { backgroundColor: isDark ? '#1f2937' : '#FFFFFF' }]} onPress={(e) => e.stopPropagation()}>
            <ThemedText style={[styles.modalTitle, { color: Colors[scheme].text }]}>{item.title}</ThemedText>
            <ThemedText style={styles.modalText}>Товар продается поштучно</ThemedText>
            <TouchableOpacity style={styles.modalButton} onPress={() => setInfoVisible(false)}>
              <ThemedText style={styles.modalButtonText}>Понятно</ThemedText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal> */}
    </View>
  );
};

export default React.memo(ProductCard, (prev, next) => {
  return (
    prev.item?.id === next.item?.id &&
    prev.isDark === next.isDark &&
    prev.CARD_WIDTH === next.CARD_WIDTH
  );
});

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
  productInfo: { marginBottom: 12, minHeight: 56 },
  title: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 16,
    height: 32,
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
    paddingHorizontal: 5,
    justifyContent: "space-between",
  },
  qtyBtnContainer: {
    // width: 32,
    // height: 32,
    // borderRadius: 16,
    // backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtn: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  qtyCount: { fontSize: 18, fontWeight: "700", textAlign: "center", },
  addBtn: {
    // width: 40,
    // height: 40,
    // borderRadius: 20,
    // backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    shadowRadius: 4,
  },
  addBtnText: { color: "#fff", fontSize: 20, fontWeight: "600" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  modalButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});