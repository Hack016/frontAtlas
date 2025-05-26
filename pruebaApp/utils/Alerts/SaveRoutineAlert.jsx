import { Pressable, StyleSheet, Text } from "react-native";
import { Dialog, Portal } from "react-native-paper";

export const SaveRoutineAlert = ({ visible, onCancel, onPost }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={styles.container}>
        <Dialog.Content>
          <Text style={styles.text}>
            Are you sure you want to save this routine?
          </Text>
          <Pressable
            onPress={onPost}
            style={({ pressed }) => [
              styles.buttonPost,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Text style={styles.buttonTextPost}>Save Routine</Text>
          </Pressable>
          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Text style={styles.buttonText}>Keep adding exercises</Text>
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
  buttonPost: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 5,
    flexDirection: "row",
  },
  buttonTextPost: {
    color: "white",
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
