import {
  View,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
} from "react-native";
import React from "react";
import { signInWithCredentials } from "../components/Signin";

const { width } = Dimensions.get("window");

export const LoginFunction = ({ navigation }) => {
  const [email, onChangeEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState("");

  async function handleLogin(email, password) {
    const result = await signInWithCredentials(email, password);
    if (result.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else {
      setMessage("Login failed :( Username equals to " + email);
    }
  }
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/TitanVectorizado.png")}
        style={styles.logo}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={onChangeEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Pressable
        style={({ pressed }) =>
          pressed ? { ...styles.button, opacity: 0.5 } : styles.button
        }
        onPress={() => {
          handleLogin(email, password);
        }}
      >
        <Text>Submit</Text>
      </Pressable>
      <Text>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: "80%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
});
