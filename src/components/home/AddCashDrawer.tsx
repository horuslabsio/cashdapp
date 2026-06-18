import * as React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { scheduleOnRN } from "react-native-worklets";
import { usePaymentModal, PaymentModal } from "@chainrails/react-native";

const FONT_SEMI = "Figtree SemiBold";
const FONT_MED = "Figtree Medium";
const FONT_REG = "Figtree";
const ACCENT_GREEN = "#01D651";

// Off-screen starting offset for the sheet. Anything >= the screen height
// would do — 800 is comfortably larger than any phone in portrait.
const HIDDEN_OFFSET = 800;

const QUICK_AMOUNTS = ["$1", "$10", "$20", "$50", "$100", "..."] as const;
const CUSTOM_KEY = "...";

// Cap the custom-amount entry at $9,999.99 — generous enough to cover any
// realistic single deposit and gives us a clean display rule.
const CUSTOM_AMOUNT_MAX = 9999.99;

type Mode = "quick" | "custom";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

/**
 * Format a raw digit string (the kind built up by tapping the keypad) as a
 * Cash App-style dollar amount. We only ever show one decimal separator,
 * capped at two digits after it. The raw input keeps the leading "$" off so
 * the keypad maths stay simple.
 */
function formatAmount(raw: string): string {
  if (raw.length === 0) return "$0";
  const [whole, frac = ""] = raw.split(".");
  // Empty whole part right after a leading "." — show "$0."
  if (whole === "" && raw.includes(".")) return "$0.";
  // Add thousands separators to the whole part.
  const wholeNum = Number(whole ?? 0);
  const wholeFmt = Number.isFinite(wholeNum)
    ? wholeNum.toLocaleString("en-US")
    : (whole ?? "");
  const fracPart = frac.length > 0 ? `.${frac.slice(0, 2)}` : "";
  return `$${wholeFmt}${fracPart}`;
}

/**
 * Apply a single keypad press to the current raw amount string and return
 * the new value (or the original if the press would push it past the cap).
 */
function applyKey(current: string, key: string): string {
  // Decimal separator — only allow one and only when there's room after it.
  if (key === ".") {
    if (current.includes(".")) return current;
    if (current.length === 0) return "0.";
    return `${current}.`;
  }

  // Backspace — drop the last char.
  if (key === "back") {
    return current.slice(0, -1);
  }

  // Digit — append, but reject if it would exceed our cap.
  const next = `${current}${key}`;
  if (Number(next) > CUSTOM_AMOUNT_MAX) return current;
  // Don't allow more than 2 digits after the decimal separator.
  if (current.includes(".")) {
    const [, frac = ""] = current.split(".");
    if (frac.length >= 2) return current;
  }
  return next;
}

/**
 * Cash App-style "Add Cash" bottom drawer.
 *
 * Animations run on the UI thread via Reanimated 4 (withTiming / withSpring)
 * and the drag-to-dismiss gesture is built with RNGH 2.x's `Gesture.Pan()`
 * builder. The component is rendered inside a `Modal` so the sheet overlays
 * the tab bar and any other screen content; the native Modal also gives us
 * automatic Android back-button dismissal via `onRequestClose`.
 *
 * Two sub-views live inside the same Modal:
 *   - "quick" mode — the default half-sheet with preset amount pills.
 *   - "custom" mode — full-screen amount entry with its own keypad, opened
 *      by tapping the "..." pill in quick mode.
 *
 * Mount lifecycle: we defer unmounting by a hair longer than the close
 * animation so the slide-down plays smoothly before the Modal disappears.
 */
export function AddCashDrawer({ visible, onClose, onSuccess }: Props) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(HIDDEN_OFFSET);
  const backdropOpacity = useSharedValue(0);

  // `mounted` controls whether the Modal is in the tree. We hold it true
  // for a brief moment after `visible` flips false so the exit animation
  // can play before the Modal unmounts.
  const [mounted, setMounted] = React.useState(false);
  // `mode` toggles between the preset quick-pick sheet and the full-screen
  // custom-amount keypad. Resets to "quick" every time the drawer closes.
  const [mode, setMode] = React.useState<Mode>("quick");
  // Raw digits typed into the custom keypad (no formatting / no "$").
  const [customRaw, setCustomRaw] = React.useState<string>("");

  React.useEffect(() => {
    if (visible) {
      setMounted(true);
      translateY.value = withTiming(0, { duration: 280 });
      backdropOpacity.value = withTiming(1, { duration: 220 });
    } else if (mounted) {
      translateY.value = withTiming(HIDDEN_OFFSET, { duration: 220 });
      backdropOpacity.value = withTiming(0, { duration: 220 });
      // Reset mode + draft amount whenever the drawer closes so a fresh
      // open always lands on the quick-pick sheet.
      setMode("quick");
      setCustomRaw("");
      const t = setTimeout(() => setMounted(false), 260);
      return () => clearTimeout(t);
    }
  }, [visible, mounted, translateY, backdropOpacity]);

  const [selected, setSelected] = React.useState<string>("$1");

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

  const handleChainRailsPayment = async (amount: string) => {
    setCrLoading(true);
    cr.open();
    try {
      const res = await fetch(
        `https://chainrails-sdk-server-nu.vercel.app/session?amount=${amount}&destinationChain=SOLANA&recipient=EAH7s1eBfr1gXoyZpgBfUfBg6yn42ZTK7onqBUEnj6fZ&token=USDC`,
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

  // Stable JS-thread wrapper for scheduleOnRN from the pan gesture.
  const requestClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  // Pan gesture is attached to the drag-handle header only — this way taps
  // on the amount pills and the Add button below go straight through to
  // their own Pressables without gesture conflict. In custom mode the
  // keypad occupies the whole sheet, so we skip the gesture entirely.
  const pan = React.useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((e) => {
          "worklet";
          // Only allow downward drag.
          translateY.value = Math.max(0, e.translationY);
        })
        .onEnd((e) => {
          "worklet";
          const shouldDismiss = e.translationY > 140 || e.velocityY > 800;
          if (shouldDismiss) {
            backdropOpacity.value = withTiming(0, { duration: 200 });
            scheduleOnRN(requestClose);
          } else {
            translateY.value = withSpring(0, {
              damping: 22,
              stiffness: 220,
            });
          }
        }),
    [translateY, backdropOpacity, requestClose],
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  // Switching into custom mode animates the backdrop away and the sheet up
  // to full-screen. We reuse the same `translateY` shared value so the
  // spring physics stay consistent.
  React.useEffect(() => {
    if (!mounted) return;
    if (mode === "custom") {
      backdropOpacity.value = withTiming(0, { duration: 220 });
      // 0 is already the resting position of the sheet (top of screen =
      // translateY 0 in our coordinate system), so no movement needed —
      // the sheet just expands to full-screen via layout styles.
    } else {
      backdropOpacity.value = withTiming(1, { duration: 220 });
    }
  }, [mode, mounted, backdropOpacity]);

  if (!mounted) return null;

  const handleQuickAmountPress = (amount: string) => {
    if (amount === CUSTOM_KEY) {
      setMode("custom");
      return;
    }
    setSelected(amount);
  };

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={mode === "custom" ? () => setMode("quick") : requestClose}
    >
      <View style={styles.root}>
        {/* Backdrop only shows in quick mode — the custom view covers the
            full screen and has its own (X) close affordance. */}
        {mode === "quick" && (
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close add cash"
              style={StyleSheet.absoluteFill}
              onPress={requestClose}
            />
          </Animated.View>
        )}

        <Animated.View
          style={[
            mode === "quick" ? styles.sheetQuick : styles.sheetCustom,
            mode === "quick" && {
              paddingBottom: Math.max(insets.bottom, 16) + 8,
            },
            mode === "custom" && { paddingTop: insets.top + 8 },
            sheetStyle,
          ]}
        >
          {mode === "quick" ? (
            // Pan gesture only wraps the quick-view sheet. In custom mode
            // the keypad catches all touches and drag-down-to-dismiss
            // would interfere with it, so we skip GestureDetector there.
            <GestureDetector gesture={pan}>
              <View
                style={[
                  styles.sheetInner,
                  mode === "quick" && { flex: undefined },
                ]}
              >
                <QuickView
                  selected={selected}
                  onPickAmount={handleQuickAmountPress}
                  onAdd={() => {
                    const amount = selected.replace("$", "");
                    handleChainRailsPayment(amount);
                  }}
                />
              </View>
            </GestureDetector>
          ) : (
            <View style={[styles.sheetInner, mode === "custom" && { flex: 1 }]}>
              <CustomAmountView
                raw={customRaw}
                onKey={(key) => setCustomRaw((cur) => applyKey(cur, key))}
                onClose={() => setMode("quick")}
                onAdd={() => {
                  const amount = customRaw || "0";
                  handleChainRailsPayment(amount);
                }}
                bottomInset={insets.bottom}
              />
            </View>
          )}
        </Animated.View>

        <PaymentModal
          {...cr}
          styles={{
            accentColor: "#01D651",
            theme: "light",
          }}
          client={{
            logoUrl:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Square_Cash_app_logo.svg/250px-Square_Cash_app_logo.svg.png",
            name: "Nova",
            paymasterEnabled: false,
          }}
        />
      </View>
    </Modal>
  );
}

/**
 * Half-sheet with preset amount pills — the default landing surface.
 */
function QuickView({
  selected,
  onPickAmount,
  onAdd,
}: {
  selected: string;
  onPickAmount: (amount: string) => void;
  onAdd: () => void;
}) {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.handle} />
      </View>

      <Text style={styles.title}>Add Cash</Text>

      <View style={styles.grid}>
        {QUICK_AMOUNTS.map((amount) => {
          const isActive = selected === amount;
          return (
            <Pressable
              key={amount}
              onPress={() => onPickAmount(amount)}
              accessibilityRole="button"
              accessibilityLabel={
                amount === CUSTOM_KEY ? "Enter custom amount" : `Add ${amount}`
              }
              accessibilityState={{ selected: isActive }}
              style={({ pressed }) => [
                styles.amountPill,
                isActive && styles.amountPillActive,
                pressed && !isActive && styles.amountPillPressed,
              ]}
            >
              <Text
                style={[styles.amountText, isActive && styles.amountTextActive]}
              >
                {amount}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add cash"
        onPress={() => {
          // Placeholder: wire up to the deposit flow once it exists.
          onAdd();
        }}
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </Pressable>
    </>
  );
}

/**
 * Full-screen custom-amount entry — top-left (X) closes back to quick view,
 * large green balance readout, and a 4×3 in-app keypad (no system keyboard).
 */
function CustomAmountView({
  raw,
  onKey,
  onClose,
  onAdd,
  bottomInset,
}: {
  raw: string;
  onKey: (key: string) => void;
  onClose: () => void;
  onAdd: () => void;
  bottomInset: number;
}) {
  const hasAmount = raw.length > 0 && Number(raw) > 0;

  return (
    <>
      <View style={styles.customHeader}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to quick amount"
          onPress={onClose}
          hitSlop={10}
          style={styles.customClose}
        >
          <CloseIcon color={ACCENT_GREEN} />
        </Pressable>
        <Text style={styles.customTitle}>Add Cash</Text>
        {/* Spacer keeps the title centered against the (X) on the left. */}
        <View style={styles.customClose} />
      </View>

      <View style={styles.amountDisplayWrap}>
        <Text
          style={styles.amountDisplay}
          numberOfLines={1}
          adjustsFontSizeToFit
          accessibilityLabel={`Amount ${formatAmount(raw)}`}
        >
          {formatAmount(raw)}
        </Text>
      </View>

      <View style={styles.keypadWrap}>
        <KeypadRow keys={["1", "2", "3"]} onKey={onKey} />
        <KeypadRow keys={["4", "5", "6"]} onKey={onKey} />
        <KeypadRow keys={["7", "8", "9"]} onKey={onKey} />
        <KeypadRow keys={[".", "0", "back"]} onKey={onKey} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add cash"
        accessibilityState={{ disabled: !hasAmount }}
        disabled={!hasAmount}
        onPress={onAdd}
        style={({ pressed }) => [
          styles.addButton,
          !hasAmount && styles.addButtonDisabled,
          pressed && hasAmount && styles.addButtonPressed,
          { marginBottom: Math.max(bottomInset, 8) },
        ]}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </Pressable>
    </>
  );
}

/**
 * One horizontal row of three keypad buttons. The middle column carries the
 * visual weight; first/third columns are symmetric.
 */
function KeypadRow({
  keys,
  onKey,
}: {
  keys: [string, string, string];
  onKey: (key: string) => void;
}) {
  return (
    <View style={styles.keypadRow}>
      {keys.map((key) => (
        <KeypadButton key={key} value={key} onKey={onKey} />
      ))}
    </View>
  );
}

function KeypadButton({
  value,
  onKey,
}: {
  value: string;
  onKey: (key: string) => void;
}) {
  const label = value === "back" ? "⌫" : value === "." ? "." : value;
  const accessibilityLabel =
    value === "back" ? "Delete" : value === "." ? "Decimal point" : value;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => onKey(value)}
      style={({ pressed }) => [
        styles.keypadButton,
        pressed && styles.keypadButtonPressed,
      ]}
    >
      <Text style={styles.keypadButtonText}>{label}</Text>
    </Pressable>
  );
}

/**
 * Simple "X" close icon. Stroked (not filled) so it sits at the same
 * visual weight as the rest of the green UI affordances.
 */
function CloseIcon({
  color = ACCENT_GREEN,
  size = 22,
}: {
  color?: string;
  size?: number;
}) {
  // Stroke width scaled to the icon size so it looks consistent at 22px.
  const stroke = Math.max(2, size * 0.14);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 6 L18 18 M18 6 L6 18"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.32)",
  },
  sheetQuick: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingHorizontal: 20,
    // Lift the sheet off the backdrop with a soft top-edge shadow.
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  sheetCustom: {
    backgroundColor: "#FFFFFF",
    paddingTop: 8,
    paddingHorizontal: 20,
    // In custom mode the sheet is full-screen — no rounded top edges.
    flex: 1,
  },
  sheetInner: {
    // Shared inner wrapper so both QuickView and CustomAmountView sit
    // cleanly inside their respective containers.
    width: "100%",
  },
  header: {
    alignItems: "center",
    paddingTop: 6,
    paddingBottom: 64,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E5E5EA",
  },
  title: {
    fontFamily: FONT_SEMI,
    fontSize: 18,
    fontWeight: "600",
    color: "#0E0E0E",
    textAlign: "center",
    marginBottom: 64,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
    marginInline: 48,
  },
  amountPill: {
    width: "30%",
    paddingVertical: 18,
    borderRadius: 14,
    backgroundColor: "#F2F2F4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  amountPillActive: {
    backgroundColor: "#0E0E0E",
  },
  amountPillPressed: {
    opacity: 0.7,
  },
  amountText: {
    fontFamily: FONT_SEMI,
    fontSize: 17,
    fontWeight: "600",
    color: "#0E0E0E",
  },
  amountTextActive: {
    color: "#FFFFFF",
  },
  addButton: {
    height: 54,
    borderRadius: 28,
    backgroundColor: ACCENT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginInline: 8,
  },
  addButtonPressed: {
    opacity: 0.9,
  },
  addButtonDisabled: {
    opacity: 0.4,
  },
  addButtonText: {
    fontFamily: FONT_SEMI,
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // ---- Custom full-screen view ----

  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  customClose: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  customTitle: {
    fontFamily: FONT_SEMI,
    fontSize: 18,
    fontWeight: "600",
    color: "#0E0E0E",
    textAlign: "center",
  },
  amountDisplayWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  amountDisplay: {
    fontFamily: FONT_REG,
    fontSize: 88,
    fontWeight: "700",
    color: ACCENT_GREEN,
    letterSpacing: -2,
    textAlign: "center",
  },
  keypadWrap: {
    paddingBottom: 12,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 6,
  },
  keypadButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  keypadButtonPressed: {
    opacity: 0.4,
  },
  keypadButtonText: {
    fontFamily: FONT_MED,
    fontSize: 32,
    fontWeight: "400",
    color: "#0E0E0E",
  },
});
