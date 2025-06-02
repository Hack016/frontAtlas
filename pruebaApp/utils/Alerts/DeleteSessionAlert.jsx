import { Pressable, StyleSheet, Text } from "react-native";
import { Dialog, Portal } from "react-native-paper";

export const DeleteSessionAlert = ({ visible, onCancel, onDiscard }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={styles.container}>
        <Dialog.Content>
          <Text style={styles.text}>
            Are you sure you want to delete this session?
          </Text>
          <Pressable
            onPress={onDiscard}
            style={({ pressed }) => [
              styles.buttonDiscard,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Text style={styles.buttonTextDiscard}>Delete session</Text>
          </Pressable>
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Text style={styles.buttonText}>Cancel</Text>
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
  buttonDiscard: {
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 5,
    flexDirection: "row",
  },
  buttonTextDiscard: {
    color: "#EE4B2B",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
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
