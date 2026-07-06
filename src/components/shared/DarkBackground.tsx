import * as React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Svg, { Circle, Defs, Pattern, Rect } from "react-native-svg";

/**
 * Dark, near-black background with a faint dot pattern — used by the
 * demo detail pages (Gaming / Fintech / Predict) to visually tie them
 * back to the home landing.
 *
 * The pattern is a tile of 20×20 dots so the repeat is invisible at any
 * reasonable device size. The dot color sits one step above the base so
 * the texture is felt, not seen.
 */
export function DarkBackground({ children, style, ...rest }: ViewProps) {
  return (
    <View style={[styles.root, style]} {...rest}>
      {/* SVG layer is absolutely positioned so it never interferes with
          the children laid out on top of it. pointerEvents is left
          default (auto) on the parent so children still receive
          touches; the SVG itself is non-interactive. */}
      <Svg
        style={StyleSheet.absoluteFill}
        width="100%"
        height="100%"
        pointerEvents="none"
      >
        <Defs>
          <Pattern
            id="dot-pattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <Circle cx="2" cy="2" r="1" fill="#FFFFFF" fillOpacity={0.06} />
          </Pattern>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#dot-pattern)" />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0B0B0B",
    overflow: "hidden",
  },
});
