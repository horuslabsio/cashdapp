import * as React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { usePaymentModal, PaymentModal } from "@chainrails/react-native";

import { useRecipientDetails } from "../../context/RecipientContext";
import { DarkBackground } from "../../components/shared/DarkBackground";
import { DarkHeader } from "../../components/shared/DarkHeader";

/**
 * Search screen - Prediction Market Demo
 *
 * Dark-themed demo page reachable from the home screen. The dark
 * background + circular back button match the other demo pages; the
 * inner card keeps the prediction-market UX (vote split, progress bar,
 * yes/no vote buttons).
 */
export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [voteType, setVoteType] = React.useState<"yes" | "no" | null>(null);
  const { details } = useRecipientDetails();
  const { amount, address: destinationAddress, chain } = details;

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
        `https://chainrails-sdk-server.vercel.app/test/create-session?amount=${amount}&destinationChain=${chain}&recipient=${destinationAddress}&token=USDC`,
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
    <DarkBackground>
      <StatusBar style="light" />
      <DarkHeader />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Prediction Card */}
        <View style={styles.predictionFrame}>
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
              <Text style={[styles.resultLabel, styles.resultLabelEnd]}>Voted No</Text>
              <Text style={styles.resultValueNo}>{noPercentage}%</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressYes, { width: `${yesPercentage}%` }]} />
            </View>
          </View>

          {/* Vote Buttons */}
          <View style={styles.voteButtons}>
            <Pressable
              style={({ pressed }) => [styles.voteButton, styles.voteYesButton, pressed && styles.buttonPressed]}
              onPress={() => handleVote("yes")}
            >
              <Text style={styles.voteButtonText}>Vote 'YES'</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.voteButton, styles.voteNoButton, pressed && styles.buttonPressed]}
              onPress={() => handleVote("no")}
            >
              <Text style={styles.voteButtonText}>Vote 'NO'</Text>
            </Pressable>
          </View>
        </View>
          </View>
      </ScrollView>

      <PaymentModal
        {...cr}
        env="internal"
      />
    </DarkBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  predictionFrame: {
    padding: 6.436,
    borderRadius: 17.163,
    borderWidth: 1.334,
    borderColor: "#3D3D3D",
    backgroundColor: "#2F2F2F",
  },
  predictionCard: {
    backgroundColor: "#141414",
    borderRadius: 12.872,
    padding: 20,
    borderWidth: 1,
    borderColor: "#FFFFFF1A",
  },
  matchInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF1A",
  },
  teamBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF14",
    alignItems: "center",
    justifyContent: "center",
  },
  teamEmoji: {
    fontSize: 20,
  },
  matchText: {
    flex: 1,
    marginLeft: 12,
  },
  matchTitle: {
    fontFamily: "Figtree",
    fontSize: 15,
    fontWeight: "500",
    color: "#FFF",
    lineHeight: 21,
    letterSpacing: -0.2,
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
    fontFamily: "Figtree",
    fontSize: 12,
    color: "#FFFFFF66",
    marginBottom: 4,
  },
  resultLabelEnd: {
    textAlign: "right",
  },
  resultValueYes: {
    fontFamily: "Figtree SemiBold",
    fontSize: 28,
    fontWeight: "600",
    color: "#009865",
    letterSpacing: -0.5,
  },
  resultValueNo: {
    fontFamily: "Figtree SemiBold",
    fontSize: 28,
    fontWeight: "600",
    color: "#EC0040",
    letterSpacing: -0.5,
    textAlign: "right",
  },
  progressBarContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#EC0040",
    borderRadius: 4,
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
    borderTopColor: "#FFFFFF1A",
  },
  voteButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
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
    fontFamily: "Figtree SemiBold",
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    letterSpacing: -0.1,
  },
});
