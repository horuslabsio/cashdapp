import * as React from "react";
import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePaymentModal, PaymentModal } from "@chainrails/react-native";

const AVATAR_URI = "https://i.pravatar.cc/160?img=12";

/**
 * Search screen - Prediction Market Demo
 *
 * This screen demonstrates a prediction market-style payment interface with ChainRails integration.
 * Users can vote on outcomes by placing bets.
 */
export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [voteType, setVoteType] = React.useState<"yes" | "no" | null>(null);
  const [amount] = React.useState(10.0);
  const destinationAddress = "0xb25aa807118aa401896826147a6ecdaae91f2f90";

  const yesPercentage = 42;
  const noPercentage = 58;

  // ChainRails payment modal
  const cr = usePaymentModal({
    sessionToken: null,
    onCancel: () => {
      console.log("Payment Cancelled");
      setVoteType(null);
    },
    onSuccess: () => {
      console.log("Payment Successful");
      setVoteType(null);
    },
  });

  const handleVote = async (type: "yes" | "no") => {
    setVoteType(type);
    cr.open();
    try {
      const res = await fetch(
        `https://chainrails-sdk-server-nu.vercel.app/session?amount=${1.49}&destinationChain=ETHEREUM&recipient=${destinationAddress}&token=USDC`,
      );
      const data = await res.json();
      cr.updateSession({
        sessionToken: data.sessionToken,
        amount: data.amount,
      });
    } catch (error) {
      console.error("Failed to create payment session:", error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Predict</Text>
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
        {/* Prediction Card */}
        <View style={styles.predictionCard}>
          <View style={styles.matchInfo}>
            <View style={styles.teamBadge}>
              <Text style={styles.teamEmoji}>⚽</Text>
            </View>
            <View style={styles.matchText}>
              <Text style={styles.matchTitle}>
                Will Bayern win a corner in the next 3 minutes?
              </Text>
            </View>
          </View>

          {/* Vote Results */}
          <View style={styles.resultsContainer}>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Voted Yes</Text>
              <Text style={styles.resultValueYes}>{yesPercentage}%</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Voted No</Text>
              <Text style={styles.resultValueNo}>{noPercentage}%</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressYes, { width: `${yesPercentage}%` }]}
              />
            </View>
          </View>

          {/* Vote Buttons */}
          <View style={styles.voteButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.voteButton,
                styles.voteYesButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => handleVote("yes")}
            >
              <Text style={styles.voteButtonText}>Vote YES</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.voteButton,
                styles.voteNoButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => handleVote("no")}
            >
              <Text style={styles.voteNoButtonText}>Vote NO</Text>
            </Pressable>
          </View>
        </View>

        {/* Demo Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Prediction Market Demo</Text>
          <Text style={styles.infoText}>
            This demo showcases a prediction market payment interface with
            ChainRails integration. Users can place bets on sports events and
            other outcomes.
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

      <PaymentModal
        {...cr}
        styles={{
          accentColor: voteType === "yes" ? "#009865" : "#EC0040",
          theme: "dark",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
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
  predictionCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  matchInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  teamBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  teamEmoji: {
    fontSize: 24,
  },
  matchText: {
    flex: 1,
    marginLeft: 12,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
    lineHeight: 22,
  },
  resultsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  resultItem: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 12,
    color: "#FFFFFF80",
    marginBottom: 4,
  },
  resultValueYes: {
    fontSize: 28,
    fontWeight: "500",
    color: "#009865",
  },
  resultValueNo: {
    fontSize: 28,
    fontWeight: "500",
    color: "#EC0040",
  },
  progressBarContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#EC0040",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressYes: {
    height: "100%",
    backgroundColor: "#009865",
  },
  voteButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  voteButton: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  voteYesButton: {
    backgroundColor: "#009865",
  },
  voteNoButton: {
    backgroundColor: "#EC0040",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  voteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  voteNoButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  infoCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#333",
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
    color: "#FFF",
  },
});
