import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BitcoinChart } from "../../components/home/BitcoinChart";
import { CashBalanceCard } from "../../components/home/CashBalanceCard";
import { FeatureTile } from "../../components/home/FeatureTile";
import { HomeHeader } from "../../components/home/HomeHeader";
import { SavingsIcon } from "../../components/home/SavingsIcon";
import { StocksChart } from "../../components/home/StocksChart";
import { TaxIllustration } from "../../components/home/TaxIllustration";
import { useSolanaBalance } from "../../hooks/useSolanaBalance";
import { AddCashDrawer } from "../../components/home/AddCashDrawer";

/**
 * Cash App "Money" home screen — 1:1 visual match for the design.
 *
 * Layout:
 *   Row 1 — title "Money" + circular avatar
 *   Row 2 — Cash Balance card with Add Cash / Cash Out pills
 *   Row 3 — Savings | Bitcoin tiles
 *   Row 4 — Stocks | Free tax filing tiles
 *
 * Tiles other than the active balance are non-interactive placeholders
 * (savings / bitcoin / stocks / free tax filing) to match the spec
 * where they're shown but disabled.
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { balance, usdValue, loading, refresh } = useSolanaBalance();
  // Approximate height of the custom tab bar (icon row + paddingBottom
  // capped at ~32 + safe-area inset). Used as bottom padding so the
  // scroll content clears the floating tab bar.
  const tabBarHeight = 60 + insets.bottom;
  const [addCashOpen, setAddCashOpen] = React.useState(false);

  const handleAddCashSuccess = React.useCallback(() => {
    setAddCashOpen(false);
    refresh();
  }, [refresh]);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        // Whole-screen light grey Cash App background.
      >
        <HomeHeader />

        <View style={styles.balanceCardWrap}>
          <CashBalanceCard
            amount={usdValue}
            solBalance={balance}
            loading={loading}
            addCashActive
            cashOutActive={false}
            onAddCashPress={() => setAddCashOpen(true)}
          />
        </View>

        <View style={styles.tilesRow}>
          <FeatureTile
            title="Savings"
            amount="$0.00"
            caption="Save for a goal"
            disabled
            accessibilityLabel="Savings, save for a goal"
          >
            <SavingsIcon />
          </FeatureTile>

          <FeatureTile
            title="Bitcoin"
            amount="$92.05"
            caption="0.50% today"
            disabled
            accessibilityLabel="Bitcoin, up 0.50% today"
          >
            <BitcoinChart />
          </FeatureTile>
        </View>

        <View style={styles.tilesRow}>
          <FeatureTile
            title="Stocks"
            amount="$2,995.85"
            caption="0.80% today"
            disabled
            accessibilityLabel="Stocks, down 0.80% today"
          >
            <StocksChart />
          </FeatureTile>

          <FeatureTile
            title="Free tax filing"
            disabled
            wide
            accessibilityLabel="Free tax filing"
          >
            <TaxIllustration />
          </FeatureTile>
        </View>
      </ScrollView>

      <AddCashDrawer
        visible={addCashOpen}
        onClose={() => setAddCashOpen(false)}
        onSuccess={handleAddCashSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F2F2F4",
  },
  scrollContent: {
    paddingTop: 0,
  },
  balanceCardWrap: {
    marginTop: 12,
  },
  tilesRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
    marginHorizontal: 16,
  },
});
