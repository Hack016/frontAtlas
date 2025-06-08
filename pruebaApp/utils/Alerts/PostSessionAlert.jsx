import { Pressable, StyleSheet, Text } from "react-native";
import { Dialog, Portal } from "react-native-paper";

export const PostSessionAlert = ({ visible, onCancel }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={styles.container}>
        <Dialog.Content>
          <Text style={styles.text}>
            You need first to name your workout in order to save it
          </Text>
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Text style={styles.buttonText}>Keep editing your workout</Text>
          </Pressable>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  text: {
    textAlign: "center",
    fontSize: 15,
    marginVertical: 10,
  },
  buttonText: {
    color: "grey",
    fontSize: 16,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
  },
  button: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 20,
    borderWidth: 0.2,
    alignItems: "center",
    marginVertical: 5,
    flexDirection: "row",
  },
});
