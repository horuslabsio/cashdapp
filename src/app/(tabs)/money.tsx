import * as React from "react";
import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePaymentModal, PaymentModal } from "@chainrails/react-native";

const AVATAR_URI = "https://i.pravatar.cc/160?img=12";

/**
 * Money screen - Fintech Demo
 *
 * This screen demonstrates a fintech-style payment interface with ChainRails integration.
 * Users can customize recipient details including destination address, chain, and amount.
 */
export default function MoneyScreen() {
  const insets = useSafeAreaInsets();
  const [actionType, setActionType] = React.useState<
    "fund" | "withdraw" | null
  >(null);
  const [amount, setAmount] = React.useState(2425.68);
  const destinationAddress = "0xb25aa807118aa401896826147a6ecdaae91f2f90";

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
        `https://chainrails-sdk-server-nu.vercel.app/session?amount=${1}&destinationChain=ETHEREUM&recipient=${destinationAddress}&token=USDC`,
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
        <Text style={styles.title}>Money</Text>
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
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance</Text>
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

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.fundButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => handleAction("fund")}
            >
              <Text style={styles.fundButtonText}>+ Fund</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.withdrawButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.withdrawButtonText}>- Withdraw</Text>
            </Pressable>
          </View>
        </View>

        {/* Demo Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Fintech Demo</Text>
          <Text style={styles.infoText}>
            This demo showcases a fintech-style payment interface with
            ChainRails integration. Tap "Fund" or "Withdraw" to open the payment
            modal directly.
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
          accentColor: "#01D651",
          theme: "light",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F4",
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
    color: "#343434",
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
    color: "#00000088",
    marginBottom: 8,
  },
  balanceCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E5E7",
  },
  balanceLabel: {
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
    fontSize: 12,
    fontWeight: "500",
    color: "#00A32F",
  },
  changeDivider: {
    marginHorizontal: 6,
    color: "#00000080",
  },
  changeSubtext: {
    fontSize: 12,
    color: "#00000080",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
  },
  actionButton: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  fundButton: {
    backgroundColor: "#000",
  },
  withdrawButton: {
    backgroundColor: "#F4F4F4",
    borderWidth: 1,
    borderColor: "#EBEBEB",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  fundButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFF",
  },
  withdrawButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
  },
  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E5E5E7",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
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
    color: "#666",
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
  },
});
