import { useTabTrigger } from "expo-router/ui";
import * as React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const INACTIVE = "#C0C0C0";
const ACTIVE = "#343434";

export type TabBarItem = {
  name: string;
  Icon: React.ComponentType<{ color: string; size?: number }>;
};

type Props = {
  tabs: TabBarItem[];
};

/**
 * Renders the 5 tab buttons in a row at the bottom of the screen. Each
 * button drives navigation through `useTabTrigger`, swapping the icon
 * color based on `isFocused`.
 */
export function CustomTabBar({ tabs }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {tabs.map((tab) => (
        <TabButton key={tab.name} name={tab.name} Icon={tab.Icon} />
      ))}
    </View>
  );
}

function TabButton({ name, Icon }: TabBarItem) {
  const { trigger, triggerProps } = useTabTrigger({ name });
  const isFocused = trigger?.isFocused ?? false;

  return (
    <Pressable
      {...triggerProps}
      style={styles.button}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
    >
      <Icon color={isFocused ? ACTIVE : INACTIVE} size={32} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.08)",
    paddingTop: 10,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
});
