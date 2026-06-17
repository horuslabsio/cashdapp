import { StyleSheet, Text, View } from "react-native";

export default function MoneyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Money</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingBottom: 90,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
});
