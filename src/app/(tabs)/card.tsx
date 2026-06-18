import * as React from "react";
import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomizeRecipientDrawer } from "../../components/demos/CustomizeRecipientDrawer";

const AVATAR_URI = "https://i.pravatar.cc/160?img=12";

/**
 * Card screen - Gaming Demo
 *
 * This screen demonstrates a gaming-style payment interface with ChainRails integration.
 * Features a game-like UI with in-game purchase functionality.
 */
export default function CardScreen() {
  const insets = useSafeAreaInsets();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [amount, setAmount] = React.useState(9.99);
  const [destinationAddress, setDestinationAddress] = React.useState(
    "0xb25aa807118aa401896826147a6ecdaae91f2f90",
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Gaming</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          hitSlop={8}
          style={styles.avatarTouch}
        >
          <Image
            source={AVATAR_URI}
            style={styles.avatar}
            contentFit="cover"
            transition={150}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Gaming Card */}
        <View style={styles.gamingCard}>
          <View style={styles.gameImage}>
            <View style={styles.gamePlaceholder}>
              <Text style={styles.gameEmoji}>🎮</Text>
            </View>
          </View>

          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>Super Block Quest</Text>
            <Text style={styles.gameSubtitle}>Level 5 - Ready to Play!</Text>

            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.priceAmount}>${amount.toFixed(2)}</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.buyButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setDrawerOpen(true)}
            >
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </Pressable>
          </View>

          {/* Game Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureEmoji}>⚡</Text>
              <Text style={styles.featureText}>Instant Access</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureEmoji}>🛡️</Text>
              <Text style={styles.featureText}>Secure Payment</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureEmoji}>🎁</Text>
              <Text style={styles.featureText}>Bonus Coins</Text>
            </View>
          </View>
        </View>

        {/* Demo Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Gaming Demo</Text>
          <Text style={styles.infoText}>
            This demo showcases a gaming-style payment interface with ChainRails
            integration. Perfect for in-game purchases, virtual goods, and
            premium content.
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Amount:</Text>
            <Text style={styles.infoValue}>${amount.toFixed(2)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Recipient:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {destinationAddress.slice(0, 6)}...{destinationAddress.slice(-4)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <CustomizeRecipientDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => {
          console.log("Payment successful!");
          setDrawerOpen(false);
        }}
        initialAmount={amount}
        initialAddress={destinationAddress}
        initialChain="ETHEREUM"
        title="Purchase Game"
        accentColor="#87afcd"
        // theme="loot-survivor-e697da73"
        theme="dark"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  title: {
    fontFamily: "Figtree SemiBold",
    fontSize: 25,
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: 32,
    color: "#FFF",
    flex: 1,
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
    padding: 16,
    paddingBottom: 100,
  },
  dashboardHeader: {
    fontSize: 12,
    color: "#FFFFFF88",
    marginBottom: 8,
  },
  gamingCard: {
    backgroundColor: "#16213e",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  gameImage: {
    height: 180,
    backgroundColor: "#0f3460",
    alignItems: "center",
    justifyContent: "center",
  },
  gamePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  gameEmoji: {
    fontSize: 40,
  },
  gameInfo: {
    padding: 16,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  gameSubtitle: {
    fontSize: 14,
    color: "#FFFFFF88",
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#FFFFFF88",
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#87afcd",
  },
  buyButton: {
    backgroundColor: "#87afcd",
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#0f3460",
  },
  feature: {
    alignItems: "center",
  },
  featureEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 11,
    color: "#FFFFFF88",
  },
  infoCard: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#FFFFFF88",
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: "#FFFFFF88",
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#87afcd",
  },
});
