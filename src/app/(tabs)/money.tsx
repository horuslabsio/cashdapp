import * as React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { usePaymentModal, PaymentModal } from "@chainrails/react-native";

import { useRecipientDetails } from "../../context/RecipientContext";
import { DarkBackground } from "../../components/shared/DarkBackground";
import { DarkHeader } from "../../components/shared/DarkHeader";

/**
 * Money screen - Fintech Demo
 *
 * Dark-themed demo page reachable from the home screen. Mirrors the
 * visual treatment of the other demo pages (dot background + circular
 * back button) and keeps the same balance-card / info-card content
 * that drives the ChainRails payment flow.
 */
export default function MoneyScreen() {
  const insets = useSafeAreaInsets();
  const [actionType, setActionType] = React.useState<"fund" | "withdraw" | null>(null);
  const { details } = useRecipientDetails();
  const { amount, address: destinationAddress, chain } = details;

  const formattedAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const parts = formattedAmount.split(".");
  const integerPart = parts[0] || "0";
  const decimalPart = parts[1] || "00";

  // ChainRails payment modal
  const cr = usePaymentModal({
    sessionToken: null,
    onCancel: () => {
      console.log("Payment Cancelled");
      setActionType(null);
    },
    onSuccess: () => {
      console.log("Payment Successful");
      setActionType(null);
    },
  });

  const handleAction = async (type: "fund" | "withdraw") => {
    setActionType(type);
    cr.open();
    try {
      const res = await fetch(
        `https://chainrails-sdk-server-nu.vercel.app/session?amount=${amount}&destinationChain=${chain}&recipient=${destinationAddress}&token=USDC`,
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
        {/* Dashboard Card */}
        <View style={styles.dashboardFrame}>
          <View style={styles.dashboardCard}>
          <Text style={styles.dashboardLabel}>Dashboard</Text>

          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.integerAmount}>{integerPart}</Text>
            <Text style={styles.decimalAmount}>.{decimalPart}</Text>
          </View>

          <View style={styles.changeContainer}>
            <Text style={styles.changePositive}>+ 12% ($277)</Text>
            <Text style={styles.changeDivider}>·</Text>
            <Text style={styles.changeSubtext}>Last 30 days</Text>
          </View>

          {/* Fund CTA — matches the mockup's single primary action */}
          <View style={styles.buttonRow}>
            <Text style={styles.fundButton} onPress={() => handleAction("fund")}>
              + Fund
            </Text>
          </View>
          </View>
        </View>
      </ScrollView>

      <PaymentModal
        {...cr}
        styles={{
          theme: "seeker-d1d25ade",
        }}
      />
    </DarkBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  dashboardFrame: {
    padding: 6.436,
    borderRadius: 17.163,
    borderWidth: 1.334,
    borderColor: "#3D3D3D",
    backgroundColor: "#2F2F2F",
  },
  dashboardCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12.872,
    padding: 24,
    borderWidth: 1,
    borderColor: "#FFFFFF14",
    // Soft outer shadow so the card lifts off the dark background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  dashboardLabel: {
    fontFamily: "Figtree",
    fontSize: 14,
    color: "#00000088",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "500",
    color: "#000",
    marginTop: 4,
  },
  integerAmount: {
    fontSize: 42,
    fontWeight: "500",
    color: "#000",
    letterSpacing: -1,
  },
  decimalAmount: {
    fontSize: 42,
    fontWeight: "500",
    color: "#00000033",
    letterSpacing: -1,
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  changePositive: {
    fontFamily: "Figtree",
    fontSize: 12,
    fontWeight: "500",
    color: "#00A32F",
  },
  changeDivider: {
    marginHorizontal: 6,
    color: "#00000080",
  },
  changeSubtext: {
    fontFamily: "Figtree",
    fontSize: 12,
    color: "#00000080",
  },
  buttonRow: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
  },
  fundButton: {
    backgroundColor: "#000000",
    color: "#FFFFFF",
    textAlign: "center",
    paddingVertical: 14,
    borderRadius: 14,
    fontFamily: "Figtree SemiBold",
    fontSize: 15,
    fontWeight: "600",
    overflow: "hidden",
  },
});
