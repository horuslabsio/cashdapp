import * as React from "react";
import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomizeRecipientDrawer } from "../../components/demos/CustomizeRecipientDrawer";
import { PaymentModal, usePaymentModal } from "@chainrails/react-native";

const AVATAR_URI = "https://i.pravatar.cc/160?img=12";

/**
 * Card screen - Gaming Demo
 *
 * This screen demonstrates a gaming-style payment interface with ChainRails integration.
 * Features a game-like UI with in-game purchase functionality.
 */
export default function CardScreen() {
  const insets = useSafeAreaInsets();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [amount, setAmount] = React.useState(9.99);
  const [destinationAddress, setDestinationAddress] = React.useState("EAH7s1eBfr1gXoyZpgBfUfBg6yn42ZTK7onqBUEnj6fZ");

  const cr = usePaymentModal({
    sessionToken: null,
    onCancel: () => {
      console.log("Payment Cancelled");
    },
    onSuccess: () => {
      console.log("Payment Successful");
    },
  });

  const handleAction = async () => {
    cr.open();
    try {
      const res = await fetch(
        `https://chainrails-sdk-server-nu.vercel.app/session?amount=${1}&destinationChain=SOLANA&recipient=${destinationAddress}&token=USDC`,
      );
      const data = await res.json();
      cr.updateSession({
        sessionToken: data.sessionToken,
        amount: data.amount,
      });
    } catch (error) {
      console.error("Failed to create payment session:", error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Gaming</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Open profile" hitSlop={8} style={styles.avatarTouch}>
          <Image source={AVATAR_URI} style={styles.avatar} contentFit="cover" transition={150} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Gaming Card */}
        <View style={styles.gamingCard}>
          <Pressable onPress={handleAction}>
            <View style={styles.gameImage}>
              <Image
                contentFit="cover"
                source={require("../../../assets/images/gaming-demo.webp")}
                style={styles.gamingDemoImage}
                alt="Gaming Demo"
              />
            </View>
          </Pressable>

          {/* <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>Super Block Quest</Text>
            <Text style={styles.gameSubtitle}>Level 5 - Ready to Play!</Text>

            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.priceAmount}>${amount.toFixed(2)}</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.buyButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setDrawerOpen(true)}
            >
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </Pressable>
          </View> */}

          {/* Game Features */}
          {/* <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureEmoji}>⚡</Text>
              <Text style={styles.featureText}>Instant Access</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureEmoji}>🛡️</Text>
              <Text style={styles.featureText}>Secure Payment</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureEmoji}>🎁</Text>
              <Text style={styles.featureText}>Bonus Coins</Text>
            </View>
          </View> */}
        </View>

        {/* Demo Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Gaming Demo</Text>
          <Text style={styles.infoText}>
            This demo showcases a gaming-style payment interface with ChainRails integration. Perfect for in-game purchases,
            virtual goods, and premium content.
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Amount:</Text>
            <Text style={styles.infoValue}>${amount.toFixed(2)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Recipient:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {destinationAddress.slice(0, 6)}...{destinationAddress.slice(-4)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <PaymentModal
        {...cr}
        styles={{
          accentColor: "#01D651",
          theme: "dark",
        }}
        css={`
          & {
            --qr-color: #87afcd;

            .cr-app-root .cr-payment-modal,
            .cr-app-root .cr-deposit-modal {
              border: none;
              background: url(https://res.cloudinary.com/du2uqkpsq/image/upload/v1780305635/Group_otiqpm.webp);
              background-size: 100% 100%;
              background-repeat: no-repeat;
              backdrop-filter: none;
              padding: 66px 50px 50px;
            }
          }

          .cr-payment-modal,
          .cr-deposit-modal {
            background: #87afcd;
            border: 2px solid #083e22;
            border-radius: 12px;
            backdrop-filter: blur(8px);
          }

          .cr-amount-display {
            background-color: #36566d;
            border-radius: 4px;
          }

          .cr-app-title {
            margin: -1px auto 2px;
            font-family: cursive;
            color: #fff !important;
            text-transform: uppercase;
            color: #87afcd;
            font-size: 1.6rem;
            font-weight: 700;
            letter-spacing: 1px;
            line-height: 1.1;
          }

          .cr-app-description {
            margin: 0px auto 4px;
            font-family: cursive;
            color: #fff !important;
            text-transform: uppercase;
            color: #36566d00;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 1px;
            line-height: 1.1;
            display: none;
          }

          .cr-app-icon {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            border: 1px solid #fff;
            background: #fff;
            overflow: hidden;
            display: none;
            img {
              width: 100%;
              height: 100%;
              border-radius: 0;
            }
          }

          .cr-close-button,
          .cr-nav-button {
            border: 1px solid #36566d00;
            background: #87afcd;
            border-radius: 8px;
            width: 48px;
            height: 48px;
            svg {
              width: 32px;
              height: 32px;
            }
          }

          .cr-divider {
            background: linear-gradient(90deg, transparent, #36566d00, transparent);
          }

          .cr-amount-form,
          .cr-amount-container,
          .cr-fees-container,
          .cr-refund-address,
          .cr-transfer-details {
            background: #36566d;
            border: 2px solid #a5cde6;
            border-radius: 8px;
            backdrop-filter: blur(8px);
            * {
              border-color: #a5cde6;
            }
            svg {
              color: #87afcd;
            }
          }

          .cr-refund-info {
            display: none;
          }

          .cr-connected-wallet {
            background: #36566d;
            border-radius: 16px;
            backdrop-filter: blur(8px);
            * {
              border-color: #a5cde6;
            }
            p {
              color: #87afcd;
            }
          }

          .cr-fees-details {
            background: transparent;
            p {
              color: #87afcd;
              opacity: 0.8;
            }
          }

          .cr-amount-label,
          .cr-fees-label,
          .cr-fees-value,
          .cr-refund-address-label,
          .cr-transfer-detail,
          .cr-transfer-value {
            line-height: 18px;
            font-family: sans-serif;
            color: #fff !important;
            text-transform: uppercase;
            color: #87afcd;
            font-size: 0.85rem;
            font-weight: 500;
            letter-spacing: 0.5px;
            margin: 0px;
            svg {
              color: #87afcd;
            }
          }

          .cr-amount-input,
          .cr-amount-value,
          .cr-refund-address-input {
            color: #87afcd;
            font-family: sans-serif;
            color: #fff !important;
            text-transform: uppercase;
          }

          .cr-amount-input::placeholder,
          .cr-amount-input:placeholder-shown {
            color: #87afcd;
            opacity: 0.5;
          }

          .cr-currency-symbol {
            color: #87afcd;
          }

          .cr-minimum-notice {
            color: rgb(52 89 111);
          }

          .cr-button,
          .cr-connecting-wallet-cta {
            background: #36566d00;
            --accent-color: #36566d00;
            border-radius: 8px;
            font-family: sans-serif;
            color: #fff !important;
            text-transform: uppercase;
            font-weight: 500;
            text-transform: uppercase;
            color: #000;
            font-size: 14px;
            &:hover {
              filter: contrast(0.7);
            }
          }

          .cr-button[disabled] {
            background: #545415;
            opacity: 0.5;
            &:hover {
              background: #68680c;
            }
          }

          .cr-payment-methods {
            gap: 8px;
            display: none;

            path {
              stroke: #000;
            }
          }

          .cr-payment-options {
            padding: 0;
            background: transparent;
            margin-top: 8px;
          }
          .cr-payment-option:nth-of-type(1) {
            display: none;
          }

          .cr-header-content {
            margin-top: 12px;
          }

          .cr-close-button,
          .cr-nav-button {
            svg {
              filter: invert(1);
            }
          }

          .cr-payment-option {
            /* background: #36566d00;
border-radius: 8px;
font-family: cursive;
font-weight: 500;
text-transform: uppercase;
color: #000;
font-size: 14px;
&:hover {
background: #EFD600;
} */
            font-weight: 500;
            font-size: 14px;
            border-radius: 8px;
            border: 0.1rem solid #a5cee7;
            background: #a5cee7;
            height: 48px;
            justify-content: center;
            &:hover {
              filter: contrast(1.2);
              backdrop-filter: blur(0px);
            }
            p {
              color: #fff;
              font-family: sans-serif;
              color: #000 !important;
              text-transform: uppercase;
              font-weight: 800;
            }
            path {
              fill: #fff;
            }
            img {
            }
          }

          .cr-network {
            display: none;
          }

          .cr-select-chain-title,
          .cr-select-wallet-title,
          .cr-transfer-text,
          .cr-select-wallet-token-text {
            margin: 0px 0px 2px 2px;
            font-family: sans-serif;
            color: #fff !important;
            text-transform: uppercase;
            font-weight: 400;
            color: #87afcd;
            font-size: 0.8rem;
            letter-spacing: 0.3px;
            line-height: 1.2;
          }

          .cr-select-chain-chain div:nth-of-type(2) {
            display: none;
          }

          .cr-select-chain-item,
          .cr-select-chain-more,
          .cr-select-chain-token,
          .cr-select-wallet-item {
            font-weight: 500;
            font-size: 14px;
            border-radius: 8px;
            border: 0.1rem solid #a5cee7;
            background: transparent;
            color: #fff;
            &:hover {
              filter: contrast(1.2);
              backdrop-filter: blur(0px);
            }
            p {
              color: #fff;
              font-family: sans-serif;
              color: #fff !important;
              text-transform: uppercase;
            }
            svg {
              color: #fff;
            }
            img {
            }
          }

          .cr-wallet-token-item {
            font-weight: 500;
            font-size: 14px;
            border-radius: 8px;
            border: 0.1rem solid #a5cee7;
            background: transparent;
            color: #fff;
            &:hover {
              filter: contrast(1.2);
              backdrop-filter: blur(0px);
            }
            p {
              font-family: cursive;
              color: #fff !important;
              text-transform: uppercase;
            }
            svg {
              color: #fff;
            }
            img {
            }
          }

          .cr-wallet-token-item-name {
            color: #fff;
          }

          .cr-wallet-token-item-balance {
            filter: saturate(1.5) contrast(2) brightness(2.2);
          }

          .cr-select-chain-eta {
          }

          .cr-refund-address-paste {
            background: transparent;
            path {
              stroke: #87afcd;
            }
          }

          .cr-select-chain-more {
            background: #87afcd;
          }

          .cr-refund-info {
            background: transparent;
            svg {
              color: #87afcd;
            }
          }

          .cr-refund-info-title,
          .cr-initiating-content-title,
          .cr-connecting-wallet-title {
            margin: 0px 0px 2px 2px;
            font-family: cursive;
            color: #fff !important;
            text-transform: uppercase;
            font-weight: 400;
            color: #87afcd;
            font-size: 0.8rem;
            letter-spacing: 0.3px;
            line-height: 1.2;
          }

          .cr-refund-info-text,
          .cr-initiating-content-text,
          .cr-connecting-wallet-subtitle {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.6);
            font-style: italic;
            cursor: pointer;
          }

          .cr-connecting-wallet-animation {
            color: #87afcd;
          }

          .cr-initiating {
            border: 0.1rem solid #a5cee7;
            background: transparent;
            path {
              stroke: #87afcd;
            }
          }

          .cr-transfer-qr {
            background: transparent;
            image {
            }
          }

          .cr-confirmation-progress {
            background: transparent;
            padding: 0;
            margin: 8px 0;
          }

          .cr-confirmation-progress-status,
          .cr-confirmation-progress-status-text {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
          }

          .cr-confirmation-progress-track {
            background: rgb(135 175 205);
            svg {
              filter: brightness(1.5);
            }
          }

          .cr-confirmation-progress-bar {
            background: rgb(22 40 26);
            border: 1px solid rgb(52 89 111);
          }

          .cr-confirmation-progress-progress {
            background: rgb(52 89 111);
          }

          .cr-confirmation-success {
          }

          .cr-powered-by-text {
            margin: 0px;
            line-height: 18px;
            font-family: sans-serif;
            color: #fff !important;
            text-transform: lowercase;
            font-weight: 100;
            color: #87afcd;
            font-size: 0.7rem;
            opacity: 0.8;
            letter-spacing: 1px;
          }
        `}
      />

      {/* <CustomizeRecipientDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => {
          console.log("Payment successful!");
          setDrawerOpen(false);
        }}
        initialAmount={amount}
        initialAddress={destinationAddress}
        initialChain="SOLANA"
        title="Purchase Game"
        accentColor="#87afcd"
        // theme="loot-survivor-e697da73"
        theme="dark"
       
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  title: {
    fontFamily: "Figtree SemiBold",
    fontSize: 25,
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: 32,
    color: "#FFF",
    flex: 1,
  },
  avatarTouch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E5EA",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  dashboardHeader: {
    fontSize: 12,
    color: "#FFFFFF88",
    marginBottom: 8,
  },
  gamingCard: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#0f346000",
    marginTop: 40,
  },
  gameImage: {
    height: 400,
    width: 360,
    marginInline: "auto",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  gamingDemoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    objectFit: "contain",
  },
  playButton: {
    position: "absolute",
    top: 60,
    left: "50%",
    width: 200,
    height: 80,
    transform: [{ translateX: -100 }],
    cursor: "pointer",
  },
  gameInfo: {
    padding: 16,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  gameSubtitle: {
    fontSize: 14,
    color: "#FFFFFF88",
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#FFFFFF88",
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#87afcd",
  },
  buyButton: {
    backgroundColor: "#87afcd",
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#0f3460",
  },
  feature: {
    alignItems: "center",
  },
  featureEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 11,
    color: "#FFFFFF88",
  },
  infoCard: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#0f3460",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#FFFFFF88",
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: "#FFFFFF88",
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#87afcd",
  },
});
