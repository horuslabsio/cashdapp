import * as React from "react";
import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { PaymentModal, usePaymentModal } from "@chainrails/react-native";

import { useRecipientDetails } from "../../context/RecipientContext";
import { DarkBackground } from "../../components/shared/DarkBackground";
import { DarkHeader } from "../../components/shared/DarkHeader";

/**
 * Card screen - Gaming Demo
 *
 * Dark-themed demo page reachable from the home screen. The visual
 * treatment (dot pattern + circular back button) ties it back to the
 * home landing, while the in-page content (game card, info) carries
 * the demo itself.
 */
export default function CardScreen() {
  const insets = useSafeAreaInsets();
  const { details } = useRecipientDetails();
  const { amount, address: destinationAddress, chain } = details;

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
        `https://chainrails-sdk-server-nu.vercel.app/session?amount=${amount}&destinationChain=${chain}&recipient=${destinationAddress}&token=USDC`,
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
    <DarkBackground>
      <StatusBar style="light" />
      <DarkHeader />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Gaming Card */}
        <View style={styles.gamingCard}>
          <Pressable onPress={handleAction}>
            <View style={styles.gameImage}>
              <Image
                contentFit="contain"
                source={require("../../../assets/images/gaming-demo.webp")}
                style={styles.gamingDemoImage}
                alt="Gaming Demo"
              />
            </View>
          </Pressable>
        </View>
      </ScrollView>

      <PaymentModal
        {...cr}
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
    </DarkBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  gamingCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 40,
  },
  gameImage: {
    height: 400,
    width: "100%",
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
});
