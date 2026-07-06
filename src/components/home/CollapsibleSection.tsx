import * as React from "react";
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const FONT_REG = "Figtree";
const FONT_SEMI = "Figtree SemiBold";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  title: string;
  /** Rendered when the section is expanded. */
  children?: React.ReactNode;
  /** Whether the section starts open. Defaults to true to match the design. */
  defaultOpen?: boolean;
};

/**
 * Simple tappable row with a title and a chevron that flips on press.
 * Uses `LayoutAnimation` for a smooth height transition so we don't need
 * a measurement-based animation. Renders `children` inline when open.
 */
export function CollapsibleSection({ title, children, defaultOpen = false }: Props) {
  const [open, setOpen] = React.useState(defaultOpen);

  const handlePress = React.useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => !prev);
  }, []);

  return (
    <View style={styles.root}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={title}
        onPress={handlePress}
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
        hitSlop={8}
      >
        <Text style={styles.title}>{title}</Text>
        <ChevronUp
          size={16}
          color="#FFFFFF"
          style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
        />
      </Pressable>

      {open && <View style={styles.body}>{children}</View>}
    </View>
  );
}

function ChevronUp({
  size = 16,
  color = "#FFFFFF",
  style,
}: {
  size?: number;
  color?: string;
  style?: any;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style}>
      <Path
        d="M4 10 L8 6 L12 10"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  headerPressed: {
    opacity: 0.7,
  },
  title: {
    fontFamily: FONT_SEMI,
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  body: {
    marginTop: 16,
  },
});
