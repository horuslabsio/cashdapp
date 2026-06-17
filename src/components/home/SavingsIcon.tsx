import * as React from "react";
import { Image } from "react-native";

/**
 * Cash App savings illustration — uses the savings.png image.
 */
export function SavingsIcon({ size = 88 }: { size?: number }) {
  return (
    <Image
      source={require("../../../assets/images/savings.png")}
      style={{ width: size, height: size, resizeMode: "contain" }}
    />
  );
}
