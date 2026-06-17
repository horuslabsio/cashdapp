import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

// Prevent the native splash screen from auto-hiding until our custom
// fonts are loaded — otherwise the "Money" title would briefly render
// in the system fallback font before snapping to Figtree.
SplashScreen.preventAutoHideAsync().catch(() => {
  /* splash already prevented or unavailable (e.g. web) — ignore */
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Figtree: require("../../assets/fonts/Figtree/Figtree-VariableFont_wght.ttf"),
    "Figtree SemiBold": require("../../assets/fonts/Figtree/static/Figtree-SemiBold.ttf"),
  });

  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {
        /* splash may not exist on web */
      });
    }
  }, [fontsLoaded, fontError]);

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      {/* Light backgrounds throughout the app, so use a dark status bar
          style (black text/icons) for legibility. Background stays
          transparent so the screen's grey bleeds through. */}
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
