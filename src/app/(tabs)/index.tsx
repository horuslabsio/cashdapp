import * as React from "react";
import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";

const AVATAR_URI = "https://i.pravatar.cc/160?img=12";
export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Move Money Across</Text>
          <Text style={styles.heroTitleAccent}>Crypto & Fiat</Text>
          <Text style={styles.heroSubtitle}>With One Integration</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>
            Chainrails helps applications accept deposits, process withdrawals, and move value across crypto and fiat without
            dealing with bridges, swaps, or payment providers.
          </Text>
          <Text style={styles.descriptionText}>
            Instead of building separate integrations for multiple chains, onramps, offramps, and settlement networks, developers
            integrate Chainrails once and gain access to global liquidity.
          </Text>
        </View>

        {/* What Can You Build */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What can you build?</Text>

          <View style={styles.useCaseGrid}>
            <Pressable
              style={({ pressed }) => [styles.useCaseCard, styles.useCaseCardFirst, pressed && styles.cardPressed]}
              onPress={() => router.push("/money")}
            >
              <Text style={styles.useCaseIcon}>💳</Text>
              <Text style={styles.useCaseTitle}>Fintech</Text>
              <Text style={styles.useCaseDescription}>Accept crypto or fiat deposits and settle where your business needs.</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.useCaseCard, styles.useCaseCardSecond, pressed && styles.cardPressed]}
              onPress={() => router.push("/card")}
            >
              <Text style={styles.useCaseIcon}>🎮</Text>
              <Text style={styles.useCaseTitle}>Gaming</Text>
              <Text style={styles.useCaseDescription}>Accept deposits from any chain and instantly fund in-game balances.</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.useCaseCard, styles.useCaseCardThird, pressed && styles.cardPressed]}
              onPress={() => router.push("/search")}
            >
              <Text style={styles.useCaseIcon}>📈</Text>
              <Text style={styles.useCaseTitle}>Prediction Markets</Text>
              <Text style={styles.useCaseDescription}>Let users participate regardless of where their funds live.</Text>
            </Pressable>
          </View>
        </View>

        {/* How This Demo Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How this demo works</Text>
          <View style={styles.demoInfoCard}>
            <Text style={styles.demoInfoText}>
              This demo showcases how Chainrails can be embedded into different application types.
            </Text>

            <View style={styles.demoSteps}>
              <View style={styles.demoStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Choose a demo scenario</Text>
                  <Text style={styles.stepDescription}>Tap a use case above or use the navigation below</Text>
                </View>
              </View>

              <View style={styles.demoStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Initiate a deposit or payment</Text>
                  <Text style={styles.stepDescription}>Try funding or withdrawing using the demo interface</Text>
                </View>
              </View>

              <View style={styles.demoStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Experience the Chainrails checkout flow</Text>
                  <Text style={styles.stepDescription}>See our embedded payment modal in action</Text>
                </View>
              </View>

              <View style={styles.demoStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>See how funds are routed and settled</Text>
                  <Text style={styles.stepDescription}>Behind the scenes, Chainrails handles the complexity</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaText}>
            Your consumer app can have this experience too — just with a simple 20-30 minute integration.
          </Text>
          <Link href="https://docs.chainrails.io/" style={styles.ctaButton} asChild>
            <Pressable style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}>
              <Text style={styles.ctaButtonText}>Get Started</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  avatarTouch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E5EA",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  heroSection: {
    marginBottom: 24,
  },
  heroTitle: {
    fontFamily: "Figtree",
    fontSize: 32,
    textAlign: "center",
    fontWeight: "600",
    color: "#000",
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heroTitleAccent: {
    fontFamily: "Figtree SemiBold",
    fontSize: 32,
    textAlign: "center",
    fontWeight: "600",
    color: "#01D651",
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontFamily: "Figtree",
    fontSize: 18,
    textAlign: "center",
    color: "#666666",
    marginTop: 4,
  },
  descriptionCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#E5E5E7",
  },
  descriptionText: {
    fontFamily: "Figtree",
    fontSize: 16,
    color: "#000",
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: 600,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Figtree SemiBold",
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  useCaseGrid: {
    gap: 12,
  },
  useCaseCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E5E7",
  },
  useCaseCardFirst: {
    borderLeftWidth: 4,
    borderLeftColor: "#01D651",
  },
  useCaseCardSecond: {
    borderLeftWidth: 4,
    borderLeftColor: "#87afcd",
  },
  useCaseCardThird: {
    borderLeftWidth: 4,
    borderLeftColor: "#009865",
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  useCaseIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  useCaseTitle: {
    fontFamily: "Figtree SemiBold",
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
  },
  useCaseDescription: {
    fontFamily: "Figtree",
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  demoInfoCard: {
    backgroundColor: "#000",
    borderRadius: 16,
    padding: 20,
  },
  demoInfoText: {
    fontFamily: "Figtree",
    fontSize: 15,
    color: "#FFFFFF",
    lineHeight: 24,
    marginBottom: 20,
  },
  demoSteps: {
    gap: 16,
  },
  demoStep: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#01D651",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumberText: {
    fontFamily: "Figtree SemiBold",
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: "Figtree SemiBold",
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 2,
  },
  stepDescription: {
    fontFamily: "Figtree",
    fontSize: 13,
    color: "#FFFFFF99",
  },
  ctaSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  ctaText: {
    fontFamily: "Figtree",
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: "#01D651",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  ctaButtonPressed: {
    opacity: 0.8,
  },
  ctaButtonText: {
    fontFamily: "Figtree SemiBold",
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  ctaLink: {
    fontFamily: "Figtree",
    fontSize: 13,
    color: "#01D651",
    textDecorationLine: "underline",
  },
});
