import React, { useEffect, useState, useCallback } from "react";

const SOLANA_ADDRESS = "EAH7s1eBfr1gXoyZpgBfUfBg6yn42ZTK7onqBUEnj6fZ";

// USDC mint address on Solana
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

// Free RPC endpoints (no API key needed)
const RPC_ENDPOINTS = [
  "https://solana-rpc.publicnode.com",
  "https://api.mainnet-beta.solana.com",
];

// CoinGecko free API for SOL price
const PRICE_API =
  "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";

type BalanceData = {
  usdcBalance: string;
  solEquivalent: string;
  loading: boolean;
  error: string | null;
};

/**
 * Hook to fetch and track the USDC balance of the specified wallet address.
 * Returns the balance in USDC and its SOL equivalent.
 */
export function useSolanaBalance() {
  const [data, setData] = useState<BalanceData>({
    usdcBalance: "0.00",
    solEquivalent: "0.0000",
    loading: true,
    error: null,
  });

  const refresh = useCallback(() => {
    setData((prev) => ({ ...prev, loading: true, error: null }));
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      let usdcBalance = 0;
      let solPrice = 0;

      // Fetch USDC token balance
      for (const rpcUrl of RPC_ENDPOINTS) {
        try {
          const response = await fetch(rpcUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "getTokenAccountsByOwner",
              params: [
                SOLANA_ADDRESS,
                { mint: USDC_MINT },
                { encoding: "jsonParsed" },
              ],
            }),
          });

          const result = await response.json();
          console.log("USDC response:", JSON.stringify(result));

          // Handle case where token account exists
          if (
            result.result &&
            result.result.value &&
            result.result.value.length > 0
          ) {
            const tokenAccount = result.result.value[0];
            usdcBalance =
              tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
          }
          break;
        } catch (err) {
          console.log("USDC fetch error:", err);
          continue;
        }
      }

      // Fetch SOL price for equivalent calculation
      try {
        const priceResponse = await fetch(PRICE_API);
        const priceData = await priceResponse.json();
        if (priceData.solana?.usd) {
          solPrice = priceData.solana.usd;
        }
      } catch (err) {
        console.log("Failed to fetch SOL price:", err);
      }

      // Calculate SOL equivalent of USDC balance
      const solEquivalent =
        solPrice > 0 ? (usdcBalance / solPrice).toFixed(4) : "0.0000";
      // Calculate USD value of SOL equivalent
      const solUsdValue = (parseFloat(solEquivalent) * solPrice).toFixed(2);

      if (mounted) {
        setData({
          usdcBalance: usdcBalance.toFixed(2),
          solEquivalent: solUsdValue,
          loading: false,
          error: usdcBalance === 0 ? "No USDC balance found" : null,
        });
      }
    }

    fetchData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return {
    balance: data.solEquivalent,
    usdValue: data.usdcBalance,
    loading: data.loading,
    error: data.error,
    refresh,
  };
}
