import { Tabs, TabList, TabSlot, TabTrigger } from "expo-router/ui";
import { StyleSheet, View } from "react-native";

import {
  CardIcon,
  PayIcon,
  SaveIcon,
  TrendingIcon,
} from "../../components/TabIcon";
import { CustomTabBar } from "../../components/CustomTabBar";

const TABS = [
  { name: "index", href: "/", Icon: SaveIcon },
  { name: "money", href: "/money", Icon: PayIcon },
  { name: "card", href: "/card", Icon: CardIcon },
  { name: "search", href: "/search", Icon: TrendingIcon },
] as const;

export default function TabsLayout() {
  return (
    <Tabs>
      <View style={styles.root}>
        <TabSlot />
        <CustomTabBar tabs={[...TABS]} />
      </View>

      {/* Hidden TabList registers each route as a tab. The visible bar
          is CustomTabBar above; this list is purely for the router. */}
      <TabList style={styles.hiddenList}>
        {TABS.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} />
        ))}
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  hiddenList: {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0,
    pointerEvents: "none",
  },
});
