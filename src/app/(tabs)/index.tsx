import * as React from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

import { CollapsibleSection } from "../../components/home/CollapsibleSection";
import { RecipientDetailsForm } from "../../components/home/RecipientDetailsForm";
import {
  GameRailsIcon,
  ChainFiIcon,
  RailPredictIcon,
  WebsiteIcon,
} from "../../components/home/DemoIcons";
import { DemoTile } from "../../components/home/DemoTile";

const FONT_REG = "Figtree";

/**
 * Home screen — the new dark-themed Chainrails landing.
 *
 * Layout: the description block is anchored to the top; the "Featured
 * Demos" row and "Advanced Settings" section are anchored to the
 * bottom of the safe area. The middle grows to fill the remaining
 * space (and gracefully scrolls if the screen is too short).
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* The rest of the app is light, so the root layout uses a dark
          status bar. Override it here so icons stay legible on the new
          dark home screen. */}
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Description — anchored to the top */}
        <View style={styles.descriptionBlock}>
          <Text style={styles.descriptionText}>
            Chainrails helps applications accept deposits, process withdrawals, and move value across
            crypto and fiat without
          </Text>
          <Text style={styles.descriptionText}>
            Instead of building separate integrations for multiple chains, onramps, offramps, and
            settlement networks, developers integrate Chainrails once and gain access to global
            liquidity.
          </Text>
        </View>

        {/* Grows to push the next block to the bottom of the visible
            area. On short screens it collapses to 0 and the ScrollView
            takes over. */}
        <View style={styles.spacer} />

        {/* Featured Demos — anchored to the bottom */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Demos</Text>

          <View style={styles.tilesRow}>
            <DemoTile
              label="GameRails"
              icon={<GameRailsIcon width={72} height={72} />}
              onPress={() => router.push("/card")}
            />
            <DemoTile
              label="ChainFi"
              icon={<ChainFiIcon width={72} height={72} />}
              onPress={() => router.push("/money")}
            />
            <DemoTile
              label="RailPredict"
              icon={<RailPredictIcon width={72} height={72} />}
              onPress={() => router.push("/search")}
            />
            <DemoTile
              label="Website"
              icon={<WebsiteIcon width={76} height={76} />}
              onPress={() => Linking.openURL("https://chainrails.io/")}
            />
          </View>
        </View>

        {/* Customize Recipient Details — anchored to the bottom */}
        <View style={styles.section}>
          <CollapsibleSection title="Customize Recipient Details">
            <RecipientDetailsForm />
          </CollapsibleSection>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0B",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    justifyContent: "space-between",
  },
  descriptionBlock: {
    marginTop: 8,
  },
  descriptionText: {
    fontFamily: FONT_REG,
    fontSize: 18,
    fontWeight: "400",
    color: "#FFFFFF",
    lineHeight: 26,
    letterSpacing: -0.2,
    marginBottom: 16,
  },
  spacer: {
    flexGrow: 1,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: FONT_REG,
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  tilesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 4,
  },
});
