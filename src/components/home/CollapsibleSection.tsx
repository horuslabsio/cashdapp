import * as React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const FONT_REG = "Figtree";
const FONT_SEMI = "Figtree SemiBold";

type Props = {
  title: string;
  /** Rendered when the section is expanded. */
  children?: React.ReactNode;
  /** Whether the section starts open. Defaults to true to match the design. */
  defaultOpen?: boolean;
};

const ENTERING = FadeIn.duration(300);
const EXITING = FadeOut.duration(300);

/**
 * Simple tappable row with a title and a chevron that flips on press.
 *
 * The body fades in/out via Reanimated 4 entering/exiting animations. We
 * deliberately do NOT use `LinearTransition` on the root: inside a
 * `ScrollView` the layout pass is driven by the final measured size of
 * siblings (e.g. the "Featured Demos" row), so animating our own height
 * while the siblings re-position instantly causes the demos to jump
 * whenever the section is opened or closed.
 */
export function CollapsibleSection({ title, children, defaultOpen = false }: Props) {
  const [open, setOpen] = React.useState(defaultOpen);

  const handlePress = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <Animated.View style={styles.root}>
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

      {open && (
        <Animated.View
          style={styles.body}
          entering={ENTERING}
          exiting={EXITING}
        >
          {children}
        </Animated.View>
      )}
    </Animated.View>
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
