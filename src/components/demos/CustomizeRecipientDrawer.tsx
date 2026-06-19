import * as React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { usePaymentModal, PaymentModal } from "@chainrails/react-native";

const FONT_SEMI = "Figtree SemiBold";
const FONT_MED = "Figtree Medium";
const FONT_REG = "Figtree";
const ACCENT_GREEN = "#01D651";

const HIDDEN_OFFSET = 800;

const CHAINS = [
  { value: "SOLANA", name: "solana" },
  { value: "ETHEREUM", name: "ethereum" },
  { value: "POLYGON", name: "polygon" },
  { value: "ARBITRUM", name: "arbitrum" },
  { value: "OPTIMISM", name: "optimism" },
  { value: "BASE", name: "base" },
] as const;

type Chain = (typeof CHAINS)[number]["value"];

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialAmount?: number;
  initialAddress?: string;
  initialChain?: Chain;
  title?: string;
  accentColor?: string;
  theme?: string;
  css?: string;
};

function Chevron({ color = "#000" }: { color?: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M5 7.5L10 12.5L15 7.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CustomizeRecipientDrawer({
  visible,
  onClose,
  onSuccess,
  initialAmount = 1.0,
  initialAddress = "0xb25aa807118aa401896826147a6ecdaae91f2f90",
  initialChain = "SOLANA",
  title = "Customize Recipient",
  accentColor = "#01D651",
  theme = "light",
  css,
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

  const [amount, setAmount] = React.useState<number>(initialAmount);
  const [destinationAddress, setDestinationAddress] =
    React.useState<string>(initialAddress);
  const [selectedChain, setSelectedChain] = React.useState<Chain>(initialChain);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [selectingChain, setSelectingChain] = React.useState(false);

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
        `https://chainrails-sdk-server-nu.vercel.app/session?amount=${amount}&destinationChain=${selectedChain}&recipient=${destinationAddress}&token=USDC`,
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

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      const shouldDismiss = e.translationY > 100 || e.velocityY > 500;
      const damping = 20;
      const stiffness = 200;

      if (shouldDismiss) {
        translateY.value = withTiming(HIDDEN_OFFSET, { duration: 220 });
        backdropOpacity.value = withTiming(0, { duration: 200 });
        setTimeout(() => setMounted(false), 260);
        requestClose();
      } else {
        translateY.value = withSpring(0, { damping, stiffness });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!mounted) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={requestClose} />
        </Animated.View>

        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.sheetContainer,
              { paddingBottom: Math.max(insets.bottom, 16) },
              sheetStyle,
            ]}
          >
            <View style={styles.handle} />

            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
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
                    stroke="#000"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </Pressable>
            </View>

            <ScrollView
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Destination Address */}
              <View style={styles.field}>
                <Text style={styles.label}>Destination Address</Text>
                <TextInput
                  style={styles.input}
                  value={destinationAddress}
                  onChangeText={setDestinationAddress}
                  placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Chain Selector */}
              <View style={styles.field}>
                <Text style={styles.label}>Chain</Text>
                <Pressable
                  style={styles.chainSelector}
                  onPress={() => setSelectingChain(!selectingChain)}
                >
                  <View style={styles.chainSelectorMain}>
                    <Text style={styles.chainText}>
                      {selectedChain.toLowerCase()}
                    </Text>
                    <Chevron color={selectingChain ? ACCENT_GREEN : "#000"} />
                  </View>
                  {selectingChain && (
                    <View style={styles.chainOptions}>
                      {CHAINS.map((chain) => (
                        <Pressable
                          key={chain.value}
                          style={[
                            styles.chainOption,
                            selectedChain === chain.value &&
                              styles.chainOptionSelected,
                          ]}
                          onPress={() => {
                            setSelectedChain(chain.value);
                            setSelectingChain(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.chainOptionText,
                              selectedChain === chain.value &&
                                styles.chainOptionTextSelected,
                            ]}
                          >
                            {chain.value.toLowerCase()}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </Pressable>
              </View>

              {/* Amount */}
              <View style={styles.field}>
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  style={styles.input}
                  value={amount.toString()}
                  onChangeText={(text) => {
                    const num = parseFloat(text);
                    if (!isNaN(num)) {
                      setAmount(num);
                    }
                  }}
                  placeholder="0.99"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
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
                    {crLoading ? "Processing..." : "Confirm"}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Animated.View>
        </GestureDetector>

        <PaymentModal
          {...cr}
          styles={{
            accentColor,
            theme: theme,
          }}
          css={css}
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
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // maxHeight: "90%",
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    height: 440,
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
    color: "#000",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  scrollContent: {
    flex: 1,
  },
  field: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  label: {
    fontFamily: FONT_REG,
    fontSize: 12,
    color: "#00000088",
    marginBottom: 8,
  },
  input: {
    height: 44,
    backgroundColor: "#EFEEF1",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontFamily: FONT_REG,
    fontSize: 14,
    color: "#000",
  },
  chainSelector: {
    backgroundColor: "#EFEEF1",
    borderRadius: 10,
    overflow: "hidden",
  },
  chainSelectorMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44,
    paddingHorizontal: 12,
  },
  chainText: {
    fontFamily: FONT_REG,
    fontSize: 14,
    color: "#000",
    textTransform: "capitalize",
  },
  chainOptions: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5E7",
    paddingVertical: 8,
  },
  chainOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  chainOptionSelected: {
    backgroundColor: "#E5E5E7",
  },
  chainOptionText: {
    fontFamily: FONT_REG,
    fontSize: 14,
    color: "#000",
    textTransform: "capitalize",
  },
  chainOptionTextSelected: {
    fontWeight: "600",
  },
  advancedToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E7",
  },
  advancedTitle: {
    fontFamily: FONT_MED,
    fontSize: 16,
    color: "#000",
  },
  advancedContent: {
    paddingHorizontal: 16,
  },
  buttonContainer: {
    padding: 16,
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
