import * as React from "react";

export const CHAINS = [
  { value: "SOLANA", name: "solana" },
  { value: "ETHEREUM", name: "ethereum" },
  { value: "POLYGON", name: "polygon" },
  { value: "ARBITRUM", name: "arbitrum" },
  { value: "OPTIMISM", name: "optimism" },
  { value: "BASE", name: "base" },
] as const;

export type ChainValue = (typeof CHAINS)[number]["value"];

export type RecipientDetails = {
  address: string;
  chain: ChainValue;
  amount: number;
};

const DEFAULTS: RecipientDetails = {
  address: "4xdL1LGGHhMpT2AvQHpPV7vzkvnPPwbQ3csQoT9Cewjk",
  chain: "SOLANA",
  amount: 1,
};

type Ctx = {
  details: RecipientDetails;
  setAddress: (address: string) => void;
  setChain: (chain: ChainValue) => void;
  setAmount: (amount: number) => void;
  reset: () => void;
};

const RecipientContext = React.createContext<Ctx | null>(null);

/**
 * Single source of truth for the recipient details (address, chain,
 * amount) used by the Chainrails payment modal across all demo screens.
 * Wrap the app (or just the tabs group) with `<RecipientProvider>` and
 * read with `useRecipientDetails()`.
 */
export function RecipientProvider({ children }: { children: React.ReactNode }) {
  const [details, setDetails] = React.useState<RecipientDetails>(DEFAULTS);

  const setAddress = React.useCallback(
    (address: string) => setDetails((d) => ({ ...d, address })),
    [],
  );
  const setChain = React.useCallback(
    (chain: ChainValue) => setDetails((d) => ({ ...d, chain })),
    [],
  );
  const setAmount = React.useCallback(
    (amount: number) =>
      setDetails((d) => ({ ...d, amount: Number.isFinite(amount) ? amount : 0 })),
    [],
  );
  const reset = React.useCallback(() => setDetails(DEFAULTS), []);

  const value = React.useMemo(
    () => ({ details, setAddress, setChain, setAmount, reset }),
    [details, setAddress, setChain, setAmount, reset],
  );

  return (
    <RecipientContext.Provider value={value}>{children}</RecipientContext.Provider>
  );
}

export function useRecipientDetails(): Ctx {
  const ctx = React.useContext(RecipientContext);
  if (!ctx) {
    throw new Error("useRecipientDetails must be used inside <RecipientProvider>");
  }
  return ctx;
}
