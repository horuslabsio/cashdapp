import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const FONT_REG = "Figtree";
const FONT_SEMI = "Figtree SemiBold";

type Props = {
  title: string;
  amount?: string;
  caption?: string;
  /** Visual content (icon / chart / illustration). */
  children?: React.ReactNode;
  /** Disabled (greyed out). */
  disabled?: boolean;
  /** When true, expand the tile to take a wider layout (used for the
   * tax filing tile which has an illustration rather than a price). */
  wide?: boolean;
  accessibilityLabel?: string;
};

/**
 * Reusable feature card used for Savings / Bitcoin / Stocks / Free tax
 * filing. Shows a title, optional price + caption, and arbitrary
 * children (icon, chart, or illustration).
 */
export function FeatureTile({
  title,
  amount,
  caption,
  children,
  disabled,
  wide,
  accessibilityLabel,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      accessibilityLabel={accessibilityLabel ?? title}
      disabled={disabled}
      style={({ pressed }) => [
        styles.tile,
        wide ? styles.wide : styles.narrow,
        disabled && styles.tileDisabled,
        pressed && !disabled && styles.tilePressed,
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.title, disabled && styles.titleDisabled]}>
          {title}
        </Text>
        <ChevronRight size={12} color={disabled ? "#BDBDC2" : "#0E0E0E"} />
      </View>

      <View style={[styles.body, wide && styles.bodyWide]}>{children}</View>

      {(amount !== undefined || caption !== undefined) && (
        <View style={styles.footer}>
          {amount !== undefined && (
            <Text style={[styles.amount, disabled && styles.amountDisabled]}>
              {amount}
            </Text>
          )}
          {caption !== undefined && (
            <View style={styles.captionRow}>
              <TrendArrow disabled={!!disabled} />
              <Text
                style={[styles.caption, disabled && styles.captionDisabled]}
              >
                {caption}
              </Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

function ChevronRight({
  size = 12,
  color = "#0E0E0E",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path
        d="M4 3 L8 6 L4 9"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function TrendArrow({ disabled }: { disabled?: boolean }) {
  const color = disabled ? "#BDBDC2" : "#8E8E93";
  return (
    <Svg width={11} height={11} viewBox="0 0 11 11" fill="none">
      <Path d="M5.5 1.5 L9 6 L7 6 L7 9.5 L4 9.5 L4 6 L2 6 Z" fill={color} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    justifyContent: "space-between",
  },
  narrow: {
    flex: 1,
  },
  wide: {
    flex: 1,
  },
  tileDisabled: {
    // opacity: 0.75,
    filter: "contrast(0.75)",
  },
  tilePressed: {
    opacity: 0.85,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: FONT_REG,
    fontSize: 15,
    fontWeight: "400",
    color: "#0E0E0E",
  },
  titleDisabled: {
    color: "#8E8E93",
  },
  body: {
    marginTop: 12,
    minHeight: 70,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  bodyWide: {
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    marginTop: 8,
  },
  amount: {
    fontFamily: FONT_SEMI,
    fontSize: 22,
    fontWeight: "600",
    color: "#0E0E0E",
    letterSpacing: -0.3,
  },
  amountDisabled: {
    color: "#3C3C43",
  },
  captionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  caption: {
    fontFamily: FONT_REG,
    fontSize: 13,
    fontWeight: "400",
    color: "#8E8E93",
  },
  captionDisabled: {
    color: "#BDBDC2",
  },
});
