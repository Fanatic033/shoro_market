import { useTheme } from '@/hooks/useTheme';
import { CartItem as CartItemType } from '@/store';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ui/ThemedText';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity?: (productId: number, quantity: number) => void;
  onRemoveItem?: (productId: number) => void;
}

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity?: (productId: number, quantity: number) => void;
  onRemoveItem?: (productId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const {  colors, adaptiveColor } = useTheme()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    onUpdateQuantity?.(item.id, newQuantity);
  };

  return (
    <View style={styles.container}>
      <Image source={item.image} style={styles.image} />

      <View style={styles.details}>
        <ThemedText style={styles.title}>{item.title}</ThemedText>
        <ThemedText style={styles.price}>
          {(item.price * item.quantity).toLocaleString('ru-RU')} c
        </ThemedText>

        <View style={styles.qtyContainer}>
          <TouchableOpacity
            onPress={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            style={styles.qtyBtnContainer}
          >
            <ThemedText style={styles.qtyBtn}>-</ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.qtyCount}>{item.quantity}</ThemedText>

          <TouchableOpacity
            onPress={() => handleQuantityChange(item.quantity + 1)}
            style={styles.qtyBtnContainer}
          >
            <ThemedText style={styles.qtyBtn}>+</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => onRemoveItem?.(item.id)}>
        <ThemedText style={[styles.removeText,{color: colors.text}]}>×</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '700',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyBtnContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 6,
    elevation: 6,
  },
  qtyBtn: {
    color: '#fff',
    fontSize: 22,
  },
  qtyCount: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  removeText: {
    fontSize: 22,
    color: 'black',
    fontWeight: '600',
    padding: 4,
  },
});
