import { useRouter } from "expo-router";
import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

type Props = {
  /**
   * Optional override for the label shown next to the back button.
   * Defaults to "Home" (matches the mockup). Pass an empty string to
   * hide the label entirely.
   */
  label?: string;
};

/**
 * Circular back button + optional label, used at the top of the dark
 * demo pages. The chevron points to the left and the whole row is
 * anchored just below the status bar.
 *
 * Navigates back via `router.back()` (expo-router) so it works whether
 * the user entered the page through the home tiles or via a deep link.
 */
export function DarkHeader({ label = "Home" }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 24 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label ? `Back to ${label}` : "Go back"}
        hitSlop={10}
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/");
          }
        }}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path
            d="M15 19L8 12L15 5"
            stroke="#FFFFFF"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1A1A1A",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#FFFFFF14",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  label: {
    marginLeft: 12,
    fontFamily: "Figtree SemiBold",
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
});
