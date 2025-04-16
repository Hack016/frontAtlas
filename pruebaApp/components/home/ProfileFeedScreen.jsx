import { Text, StyleSheet } from "react-native";

export default function ProfileFeedScreen() {
  return <Text style={styles.text}>Profile</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
