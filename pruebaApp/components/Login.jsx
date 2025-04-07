import {
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
} from "react-native";
import React from "react";
import { TextInput } from "react-native-paper";
import { signInWithCredentials } from "../components/Signin";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require("../assets/TitanVectorizado.png")}
          style={styles.logo}
        />
        <TextInput
          style={styles.input}
          label="Email"
          onChangeText={onChangeEmail}
          value={email}
          mode="outlined"
          outlineColor="#007BFF"
          activeOutlineColor="#007BFF"
          activeUnderlineColor="#007BFF"
        />
        <TextInput
          style={styles.input}
          label="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          mode="outlined"
          outlineColor="#007BFF"
          activeOutlineColor="#007BFF"
          activeUnderlineColor="#007BFF"
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: "80%",
    margin: 12,
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
