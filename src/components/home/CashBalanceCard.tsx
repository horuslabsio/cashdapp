import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const FONT_REG = "Figtree";
const FONT_SEMI = "Figtree SemiBold";

type Props = {
  /** Cash App balance label. */
  label?: string;
  /** The balance string to show (formatted already) - USD value. */
  amount: string;
  /** The SOL balance to show in the header. */
  solBalance: string;
  /** Loading state */
  loading?: boolean;
  /** "Add Cash" pressed state — when true the pill is filled/active. */
  addCashActive: boolean;
  /** "Cash Out" pressed state. */
  cashOutActive: boolean;
  /** Fired when the "Add Cash" pill is tapped. */
  onAddCashPress?: () => void;
  /** Fired when the "Cash Out" pill is tapped. */
  onCashOutPress?: () => void;
};

/**
 * Top balance card. Includes the "Cash Balance" / "Account & Routing"
 * header row and the two pill buttons underneath. Per the spec, the
 * pill is the active one when the user is currently on that action.
 */
export function CashBalanceCard({
  label = "Cash Balance",
  amount,
  solBalance,
  loading = false,
  addCashActive,
  cashOutActive,
  onAddCashPress,
  onCashOutPress,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.balanceLabel}>{label}</Text>
        {loading ? (
          <View style={styles.skeletonLineSmall} />
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Account and routing"
            style={styles.accountRouting}
            hitSlop={6}
          >
            <Text style={styles.accountRoutingText}>~ ${solBalance}</Text>
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={styles.skeletonLine} />
      ) : (
        <Text style={styles.amount} accessibilityLabel={`Balance ${amount}`}>
          {amount} USDC
        </Text>
      )}

      <View style={styles.actionsRow}>
        <PillButton
          label="Add Cash"
          active={addCashActive}
          onPress={onAddCashPress}
        />
        <PillButton
          label="Cash Out"
          active={cashOutActive}
          onPress={onCashOutPress}
        />
      </View>
    </View>
  );
}

function PillButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function ChevronRight({
  size = 14,
  color = "#0E0E0E",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M5 3 L9 7 L5 11"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    marginHorizontal: 16,
    // Subtle elevation (works on iOS); Android falls back to flat.
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  balanceLabel: {
    fontFamily: FONT_REG,
    fontSize: 15,
    fontWeight: "400",
    color: "#0E0E0E",
  },
  accountRouting: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  accountRoutingText: {
    fontFamily: FONT_SEMI,
    fontSize: 16,
    fontWeight: "400",
    color: "#0E0E0E",
  },
  amount: {
    marginTop: 8,
    fontFamily: FONT_SEMI,
    fontSize: 42,
    fontWeight: "600",
    color: "#0E0E0E",
    letterSpacing: -1,
  },
  skeletonLine: {
    marginTop: 8,
    width: 140,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#E5E5EA",
  },
  skeletonLineSmall: {
    width: 60,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#E5E5EA",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 40,
  },
  pill: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  pillActive: {
    backgroundColor: "#0E0E0E",
  },
  pillInactive: {
    backgroundColor: "#F2F2F4",
    filter: "contrast(0.5) opacity(0.5)",
  },
  pillText: {
    fontFamily: FONT_REG,
    fontSize: 16,
    fontWeight: "400",
    color: "#0E0E0E",
  },
  pillTextActive: {
    color: "#FFFFFF",
  },
});
