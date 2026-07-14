import * as React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { usePaymentModal, PaymentModal } from "@chainrails/react-native";

const FONT_SEMI = "Figtree SemiBold";
const FONT_MED = "Figtree Medium";
const FONT_REG = "Figtree";

const HIDDEN_OFFSET = 800;

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  amount: number;
  destinationAddress: string;
  chain: string;
  title?: string;
  theme?: "light" | "dark";
  accentColor?: string;
  customCss?: string;
};

export function PaymentDrawer({
  visible,
  onClose,
  onSuccess,
  amount,
  destinationAddress,
  chain,
  title = "Payment",
  theme = "light",
  accentColor = "#01D651",
}: Props) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(HIDDEN_OFFSET);
  const backdropOpacity = useSharedValue(0);

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      setMounted(true);
      translateY.value = withTiming(0, { duration: 280 });
      backdropOpacity.value = withTiming(1, { duration: 220 });
    } else if (mounted) {
      translateY.value = withTiming(HIDDEN_OFFSET, { duration: 220 });
      backdropOpacity.value = withTiming(0, { duration: 220 });
      const t = setTimeout(() => setMounted(false), 260);
      return () => clearTimeout(t);
    }
  }, [visible, mounted, translateY, backdropOpacity]);

  // ChainRails payment modal
  const [crLoading, setCrLoading] = React.useState(false);
  const cr = usePaymentModal({
    sessionToken: null,
    onCancel: () => {
      console.log("Payment Cancelled");
      setCrLoading(false);
      onClose();
    },
    onSuccess: () => {
      console.log("Payment Successful");
      setCrLoading(false);
      onSuccess?.();
    },
  });

  const handleChainRailsPayment = async () => {
    setCrLoading(true);
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
      setCrLoading(false);
    }
  };

  const requestClose = () => {
    onClose();
  };

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  // Auto-open payment when drawer mounts
  React.useEffect(() => {
    if (mounted && visible) {
      // Small delay to ensure modal is ready
      const timer = setTimeout(() => {
        handleChainRailsPayment();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [mounted, visible]);

  if (!mounted) return null;

  const isDark = theme === "dark";
  const backgroundColor = isDark ? "#1E1E1E" : "#FFF";
  const textColor = isDark ? "#FFF" : "#000";
  const secondaryTextColor = isDark ? "#FFFFFF88" : "#00000088";

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={requestClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheetContainer,
            { backgroundColor, paddingBottom: Math.max(insets.bottom, 16) },
            sheetStyle,
          ]}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={requestClose}
              hitSlop={10}
              style={styles.closeButton}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 6L6 18M6 6L18 18"
                  stroke={textColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.amountContainer}>
              <Text style={[styles.amountLabel, { color: secondaryTextColor }]}>
                Amount
              </Text>
              <Text style={[styles.amountValue, { color: accentColor }]}>
                ${amount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: secondaryTextColor }]}>
                To
              </Text>
              <Text
                style={[styles.detailValue, { color: textColor }]}
                numberOfLines={1}
              >
                {destinationAddress.slice(0, 6)}...{destinationAddress.slice(-4)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: secondaryTextColor }]}>
                Network
              </Text>
              <Text style={[styles.detailValue, { color: textColor }]}>
                {chain.toLowerCase()}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.submitButton,
                  { backgroundColor: accentColor },
                  pressed && styles.submitButtonPressed,
                ]}
                onPress={handleChainRailsPayment}
                disabled={crLoading}
              >
                <Text style={styles.submitButtonText}>
                  {crLoading ? "Processing..." : "Pay Now"}
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        <PaymentModal
          {...cr}
          env="internal"
          styles={{
            theme,
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E5E5E7",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E7",
    position: "relative",
  },
  title: {
    fontFamily: FONT_SEMI,
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  content: {
    padding: 16,
  },
  amountContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  amountLabel: {
    fontFamily: FONT_REG,
    fontSize: 14,
    marginBottom: 8,
  },
  amountValue: {
    fontFamily: FONT_SEMI,
    fontSize: 36,
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E7",
  },
  detailLabel: {
    fontFamily: FONT_REG,
    fontSize: 14,
  },
  detailValue: {
    fontFamily: FONT_MED,
    fontSize: 14,
  },
  buttonContainer: {
    paddingTop: 24,
  },
  submitButton: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonPressed: {
    opacity: 0.8,
  },
  submitButtonText: {
    fontFamily: FONT_SEMI,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
