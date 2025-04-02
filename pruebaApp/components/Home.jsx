import { Text, StyleSheet } from "react-native";

export function Home() {
  return <Text style={styles.text}>Home</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
