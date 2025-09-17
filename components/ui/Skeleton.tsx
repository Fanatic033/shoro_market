import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

import { useColorScheme } from "../../hooks/useColorScheme";
import { Colors } from "../../utils/constants/Colors";

import { ThemedView } from "./ThemedView";

type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  style?: ViewStyle | ViewStyle[];
  radius?: number;
};

export const Skeleton = ({ width = "100%", height = 16, style, radius = 8 }: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius: radius, opacity },
        style as any,
      ]}
    />
  );
};

export const ProductSkeletonCard = ({ width }: { width: number }) => {
  const scheme = useColorScheme() ?? "light";
  const skeletonBarColor = scheme === "dark" ? "#2A2F36" : "#E5E7EB";

  return (
    <ThemedView
      style={[
        styles.card,
        {
          width,
          borderColor: Colors[scheme].border,
        },
      ]}
      lightColor={Colors.light.card}
      darkColor={Colors.dark.card}
    >
      <Skeleton height={140} radius={12} style={[styles.mb8, { backgroundColor: skeletonBarColor }]} />
      <Skeleton height={16} radius={6} style={[styles.mb8, { backgroundColor: skeletonBarColor }]} />
      <Skeleton height={16} radius={6} style={[styles.mb12, { width: "60%", backgroundColor: skeletonBarColor }]} />
      <View style={{ alignItems: "flex-end" }}>
        <Skeleton width={40} height={40} radius={20} style={{ backgroundColor: skeletonBarColor }} />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#E5E7EB",
  },
  card: {
    borderRadius: 16,
    padding: 12,
    margin: 8,
    borderWidth: 1,
  },
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
});

export default Skeleton;


