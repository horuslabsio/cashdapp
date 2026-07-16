# Chainrails Playground - ChainRails Demo

A React Native mobile application built with Expo that showcases ChainRails payment integration through multiple demo interfaces.

## Demos

The app features four different payment demo pages:

### 1. Home
- ChainRails introduction with use case cards
- Interactive navigation to demo pages
- 4-step walkthrough explaining how the demo works
- "Get Started" CTA section

### 2. Fintech
- Fintech-style dashboard with balance card
- Fund/Withdraw buttons opening ChainRails modal directly
- Light theme with green accent (#01D651)
- **Default chain: Solana**

### 3. Gaming
- Game purchase interface with customizable recipient details
- Interactive drawer for customizing:
  - Destination address
  - Chain selection (Solana, Ethereum, Polygon, Arbitrum, Optimism, Base)
  - Amount
- Blue gaming-themed accent color (#87afcd)
- **Default chain: Solana**

### 4. Prediction Market
- Sports prediction market interface
- YES/NO voting with real-time percentage display
- Opens ChainRails modal directly with:
  - Green accent (#009865) for YES votes
  - Red accent (#EC0040) for NO votes
- Dark theme
- **Default chain: Solana**

## Tech Stack

- **Framework**: Expo SDK 56 with Expo Router
- **Language**: TypeScript
- **UI**: React Native with react-native-reanimated
- **Payments**: ChainRails SDK (@chainrails/react-native)
- **Styling**: StyleSheet with custom theming

## Project Structure

```
src/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── money.tsx      # Fintech demo
│   │   ├── card.tsx       # Gaming demo
│   │   └── search.tsx     # Prediction market demo
│   └── _layout.tsx        # Root layout
├── components/
│   ├── home/              # Home screen components
│   │   ├── AddCashDrawer.tsx
│   │   ├── BitcoinChart.tsx
│   │   ├── CashBalanceCard.tsx
│   │   ├── FeatureTile.tsx
│   │   ├── HomeHeader.tsx
│   │   └── ...
│   ├── demos/             # Demo components
│   │   ├── CustomizeRecipientDrawer.tsx
│   │   └── PaymentDrawer.tsx
│   ├── CustomTabBar.tsx   # Custom bottom tab bar
│   └── TabIcon.tsx        # Tab icons
└── hooks/
    └── useSolanaBalance.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- Expo CLI
- Android Studio (for Android)
- Xcode (for iOS)

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

## ChainRails Integration

The app demonstrates two payment flows:

1. **Direct Modal** - Opens ChainRails payment modal immediately (Home, Fintech, Prediction pages)
2. **Customization Drawer** - Shows a drawer first with recipient customization options before opening the modal (Gaming page)

### Payment Session API

The app uses a demo server to create payment sessions:

```typescript
const res = await fetch(
  `https://chainrails-sdk-server-nu.vercel.app/session?amount=${amount}&destinationChain=${chain}&recipient=${recipient}&token=USDC`,
);
const data = await res.json();
cr.updateSession({
  sessionToken: data.sessionToken,
  amount: data.amount,
});
```

## Default Chain

All demos default to **Solana** for the destination chain, targeting Solana users specifically.

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

### Blockchain & Payments
- `@solana/web3.js` ^1.98.4
- `@chainrails/react-native` ^0.0.22

## App Configuration

App configuration is in `app.json`:
- Package name: `com.chainrails.playground`
- iOS bundle identifier: `com.chainrails.playground`
- App name: `Chainrails Playground`

## License

MIT License - see LICENSE file for details.
