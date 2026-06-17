# Cash Dapp

A React Native mobile application built with Expo that provides a Cash App-inspired interface with Solana blockchain integration for balance tracking and on-chain payments.

## Features

- **Cash Balance Display** - View your USDC balance with real-time USD value
- **Solana Integration** - Connect to Solana blockchain to fetch wallet balances
- **Add Cash Flow** - Interactive drawer for adding funds via ChainRails payment integration
- **Feature Tiles** - Visual placeholders for Savings, Bitcoin, Stocks, and Tax Filing
- **Tab Navigation** - Bottom tab bar with Home, Activity, Card, Money, and Search screens
- **Modern UI** - Glass effects, smooth animations, and Cash App-inspired design

## Tech Stack

- **Framework**: Expo SDK 56 with Expo Router for file-based routing
- **Language**: TypeScript
- **UI**: React Native with react-native-reanimated for animations
- **Blockchain**: Solana Web3.js for on-chain interactions
- **Payments**: ChainRails SDK for payment processing
- **Styling**: StyleSheet with custom theming

## Project Structure

```
src/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── activity.tsx   # Activity screen
│   │   ├── card.tsx       # Card screen
│   │   ├── money.tsx      # Money screen
│   │   └── search.tsx     # Search screen
│   └── _layout.tsx        # Root layout
├── components/
│   ├── home/              # Home screen components
│   │   ├── AddCashDrawer.tsx
│   │   ├── BitcoinChart.tsx
│   │   ├── CashBalanceCard.tsx
│   │   ├── FeatureTile.tsx
│   │   ├── HomeHeader.tsx
│   │   ├── SavingsIcon.tsx
│   │   ├── StocksChart.tsx
│   │   └── TaxIllustration.tsx
│   ├── CustomTabBar.tsx   # Custom bottom tab bar
│   └── TabIcon.tsx        # Tab icon component
└── hooks/
    └── useSolanaBalance.ts  # Solana balance fetching hook
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

```bash
# Install dependencies
npm install

# Or with bun
bun install
```

### Running the App

```bash
# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

### Environment Variables

The app uses the following default configurations:

- **Solana RPC**: Public nodes (no API key required)
- **Price API**: CoinGecko for SOL/USD pricing
- **Wallet Address**: Configurable in `src/hooks/useSolanaBalance.ts`

## Configuration

### Wallet Address

To change the tracked wallet address, edit `src/hooks/useSolanaBalance.ts`:

```typescript
const SOLANA_ADDRESS = "YOUR_WALLET_ADDRESS";
```

### App Metadata

App configuration is in `app.json`:
- Package name: `com.cashdapp.mobile`
- iOS bundle identifier: `com.cashdapp.mobile`
- App name: `Cash Dapp`

## Dependencies

### Core
- `expo` ~56.0.12
- `react` 19.2.3
- `react-native` 0.85.3

### Navigation
- `expo-router` ~56.2.11
- `react-native-screens` 4.25.2
- `react-native-safe-area-context` ~5.7.0

### UI & Animation
- `expo-glass-effect` ~56.0.4
- `expo-image` ~56.0.11
- `expo-symbols` ~56.0.6
- `react-native-reanimated` 4.3.1
- `react-native-gesture-handler` ~2.31.1
- `react-native-svg` 15.15.4

### Blockchain
- `@solana/web3.js` ^1.98.4
- `@chainrails/react-native` ^0.0.22

## License

MIT License - see LICENSE file for details.
