import {
  ConnectionProvider,
  useConnection,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { ReactNode, useMemo } from "react";

// Default RPC endpoints
const RPC_ENDPOINTS = [
  "https://solana-rpc.publicnode.com",
  "https://api.mainnet-beta.solana.com",
  "https://solana-mainnet.g.alchemy.com/v2/demo",
];

// Default network: mainnet
const NETWORK = "mainnet";

/**
 * SolanaProvider - Wraps the app with Solana wallet context
 *
 * This provider:
 * - Sets up the RPC connection to Solana
 * - Initializes wallet adapters (Phantom, Solflare, etc.)
 * - Enables mobile wallet connection via MWA
 *
 * Usage:
 * ```tsx
 * <SolanaProvider>
 *   <YourApp />
 * </SolanaProvider>
 * ```
 */
export function SolanaProvider({ children }: { children: ReactNode }) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider
      endpoint={RPC_ENDPOINTS[0]}
      config={{
        commitment: "confirmed",
        wsEndpoint: RPC_ENDPOINTS[0].replace("https://", "wss://"),
      }}
    >
      <WalletProvider
        wallets={wallets}
        autoConnect={false} // Don't auto-connect, let user choose
        onError={(error) => {
          console.error("Wallet error:", error);
        }}
      >
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}

/**
 * useSolanaWallet - Hook for accessing wallet state and actions
 *
 * Returns:
 * - connection: Solana connection instance
 * - publicKey: Current wallet's public key
 * - connected: Whether wallet is connected
 * - connecting: Whether connection is in progress
 * - disconnect: Function to disconnect wallet
 * - connect: Function to trigger wallet connection modal
 * - sendTransaction: Function to send a transaction
 * - signTransaction: Function to sign a transaction
 * - signMessage: Function to sign a message
 */
export { useConnection, useWallet };

/**
 * useWalletAddress - Convenience hook for getting just the wallet address
 */
export function useWalletAddress(): string | null {
  const { publicKey } = useWallet();
  return publicKey?.toBase58() ?? null;
}

/**
 * useWalletBalance - Hook for getting the wallet's SOL balance
 */
import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export function useWalletBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connection || !publicKey) {
      setBalance(null);
      return;
    }

    let mounted = true;
    setLoading(true);

    async function fetchBalance() {
      try {
        const lamports = await connection.getBalance(publicKey);
        if (mounted) {
          setBalance(lamports / LAMPORTS_PER_SOL);
        }
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        if (mounted) {
          setBalance(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchBalance();

    // Subscribe to balance changes
    const subscriptionId = connection.onAccountChange(
      publicKey,
      (account) => {
        if (mounted && account) {
          setBalance(account.lamports / LAMPORTS_PER_SOL);
        }
      }
    );

    return () => {
      mounted = false;
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection, publicKey]);

  return { balance, loading };
}
