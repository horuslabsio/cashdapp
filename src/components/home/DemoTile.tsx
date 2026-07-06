import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const FONT_REG = "Figtree";

type Props = {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/**
 * Single entry in the "Featured Demos" row. The icon is expected to be
 * a self-contained SVG (background + foreground baked in), so the tile
 * itself is just a touch target with a label underneath.
 */
export function DemoTile({ label, icon, onPress, accessibilityLabel }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [styles.touch, pressed && styles.pressed]}
      hitSlop={6}
    >
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touch: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: 80,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  iconWrap: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 10,
    fontFamily: FONT_REG,
    fontSize: 12,
    fontWeight: "400",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.1,
  },
});
