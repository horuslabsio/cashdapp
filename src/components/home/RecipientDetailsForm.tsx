import * as React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { CHAINS, useRecipientDetails, type ChainValue } from "../../context/RecipientContext";

const FONT_REG = "Figtree";
const FONT_SEMI = "Figtree SemiBold";
const INPUT_BG = "#1C1C1E";
const LABEL_COLOR = "#FFFFFF80";
const TEXT_COLOR = "#FFFFFF";
const ACCENT = "#01D651";

/**
 * Dark-themed version of the recipient form, embedded inline on the
 * home screen. Mirrors the form the demo drawer's "Customize Recipient"
 * screen uses, but reads/writes the global recipient context so the
 * values flow into the payment modal's session request.
 */
export function RecipientDetailsForm() {
  const { details, setAddress, setChain, setAmount, reset } = useRecipientDetails();
  const [selectingChain, setSelectingChain] = React.useState(false);

  return (
    <View style={styles.scrollContent}>
      <View style={styles.field}>
        <Text style={styles.label}>Destination Address</Text>
        <TextInput
          style={styles.input}
          value={details.address}
          onChangeText={setAddress}
          placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
          placeholderTextColor="#FFFFFF55"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Chain</Text>
        <View style={styles.chainWrap}>
          <Pressable
            style={styles.chainSelector}
            onPress={() => setSelectingChain((s) => !s)}
          >
            <Text
              style={[
                styles.chainText,
                selectingChain && { opacity: 0.4 },
              ]}
            >
              {details.chain.toLowerCase()}
            </Text>
            <Chevron
              color={selectingChain ? ACCENT : "#FFFFFF"}
              size={22}
              style={{ transform: [{ rotate: selectingChain ? "180deg" : "0deg" }] }}
            />
          </Pressable>

          {selectingChain && (
            <View style={styles.chainOptions}>
              {CHAINS.map((chain) => {
                const selected = details.chain === chain.value;
                return (
                  <Pressable
                    key={chain.value}
                    style={[styles.chainOption, selected && styles.chainOptionSelected]}
                    onPress={() => {
                      setChain(chain.value as ChainValue);
                      setSelectingChain(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.chainOptionText,
                        selected && styles.chainOptionTextSelected,
                      ]}
                    >
                      {chain.value.toLowerCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={String(details.amount)}
          onChangeText={(text) => {
            const num = parseFloat(text);
            setAmount(Number.isFinite(num) ? num : 0);
          }}
          placeholder="0.99"
          placeholderTextColor="#FFFFFF55"
          keyboardType="decimal-pad"
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Reset to defaults"
        onPress={reset}
        style={({ pressed }) => [styles.resetButton, pressed && styles.resetButtonPressed]}
      >
        <Text style={styles.resetButtonText}>Reset to defaults</Text>
      </Pressable>
    </View>
  );
}

function Chevron({
  color = "#FFFFFF",
  size = 22,
  style,
}: {
  color?: string;
  size?: number;
  style?: any;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={style}>
      <Path
        d="M5 7.5L10 12.5L15 7.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  field: {
    marginTop: 16,
  },
  label: {
    fontFamily: FONT_REG,
    fontSize: 12,
    color: LABEL_COLOR,
    marginBottom: 8,
    letterSpacing: -0.24,
  },
  input: {
    height: 38,
    backgroundColor: INPUT_BG,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontFamily: FONT_REG,
    fontSize: 14,
    color: TEXT_COLOR,
  },
  chainWrap: {
    backgroundColor: INPUT_BG,
    borderRadius: 10,
    overflow: "hidden",
  },
  chainSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 38,
    paddingHorizontal: 10,
  },
  chainText: {
    fontFamily: FONT_REG,
    fontSize: 14,
    color: TEXT_COLOR,
    textTransform: "capitalize",
    letterSpacing: -0.28,
  },
  chainOptions: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#FFFFFF14",
    paddingVertical: 6,
  },
  chainOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  chainOptionSelected: {
    backgroundColor: "#FFFFFF14",
  },
  chainOptionText: {
    fontFamily: FONT_REG,
    fontSize: 14,
    color: TEXT_COLOR,
    textTransform: "capitalize",
  },
  chainOptionTextSelected: {
    fontFamily: FONT_SEMI,
    color: ACCENT,
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF1F",
  },
  resetButtonPressed: {
    opacity: 0.7,
  },
  resetButtonText: {
    fontFamily: FONT_REG,
    fontSize: 13,
    color: "#FFFFFFB3",
  },
});
