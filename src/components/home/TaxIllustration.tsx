import * as React from "react";
import { Image } from "react-native";

/**
 * "Free tax filing" illustration — uses the filing.png image.
 */
export function TaxIllustration({
  width = 160,
  height = 80,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      source={require("../../../assets/images/filing.png")}
      style={{ width, height, resizeMode: "contain" }}
    />
  );
}
