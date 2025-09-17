import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useCartStore } from '@/store';

interface CartBadgeProps {
  size?: number;
}

const CartBadge: React.FC<CartBadgeProps> = ({ size = 20 }) => {
  const { items } = useCartStore();
  const distinctCount = items.length;

  if (distinctCount === 0) return null;

  return (
    <View style={[styles.badge, { width: size, height: size }]}>
      <Text style={[styles.text, { fontSize: size * 0.6 }]}>
        {distinctCount > 99 ? '99+' : distinctCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#DC143C',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 20,
    minHeight: 20,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CartBadge;
