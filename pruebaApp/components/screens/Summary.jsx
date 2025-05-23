import { Text, StyleSheet } from "react-native";

export default function Summary() {
  return <Text style={styles.text}>Summary</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
