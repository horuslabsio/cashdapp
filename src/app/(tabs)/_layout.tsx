import { Tabs, TabList, TabSlot, TabTrigger } from "expo-router/ui";
import { StyleSheet, View } from "react-native";

import {
  CardIcon,
  PayIcon,
  SaveIcon,
  TrendingIcon,
} from "../../components/TabIcon";
import { RecipientProvider } from "../../context/RecipientContext";

const TABS = [
  { name: "index", href: "/", Icon: SaveIcon },
  { name: "money", href: "/money", Icon: PayIcon },
  { name: "card", href: "/card", Icon: CardIcon },
  { name: "search", href: "/search", Icon: TrendingIcon },
] as const;

export default function TabsLayout() {
  return (
    <RecipientProvider>
      <Tabs>
        <View style={styles.root}>
          {/* Keep inactive tabs mounted so local component state (e.g. the
              "Customize Recipient Details" CollapsibleSection) is preserved
              when navigating to /card, /money, /search and back. Without
              this, the home tab is detached and re-initialized on focus,
              which causes the recipient section to flicker up/down. */}
          <TabSlot detachInactiveScreens={false} />
        </View>

        {/* Hidden TabList registers each route as a tab so router.push to
            /money, /card, /search still works. No visible bar is rendered. */}
        <TabList style={styles.hiddenList}>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} />
          ))}
        </TabList>
      </Tabs>
    </RecipientProvider>
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
