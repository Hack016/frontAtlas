import {
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
} from "react-native";
import { TextInput } from "react-native-paper";
import React from "react";
import { signInWithCredentials } from "../components/Signin";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export const RegisterFunction = ({ navigation }) => {
  const [email, onChangeEmail] = React.useState("");
  const [nombre, onChangeNombre] = React.useState("");
  const [Username, onChangeUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [passwordRepeated, setPasswordRepeated] = React.useState("");

  async function handleRegister(email, password) {
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
          label="Name"
          onChangeText={onChangeNombre}
          value={nombre}
          mode="outlined"
          outlineColor="#007BFF"
          activeOutlineColor="#007BFF"
          activeUnderlineColor="#007BFF"
        />
        <TextInput
          style={styles.input}
          label="Username"
          onChangeText={onChangeUsername}
          value={Username}
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
        <TextInput
          style={styles.input}
          label="Repeat Password"
          onChangeText={setPasswordRepeated}
          value={passwordRepeated}
          secureTextEntry
          mode="outlined"
          outlineColor="#007BFF"
          activeOutlineColor="#007BFF"
          activeUnderlineColor="#007BFF"
        />
        {/* if (password !== passwordRepeated) {
        setMessage("Passwords do not match");
      } */}
        <Pressable
          style={({ pressed }) =>
            pressed ? { ...styles.button, opacity: 0.5 } : styles.button
          }
          onPress={() => {
            handleRegister(email, password);
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
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    fontFamily: "seriff",
    fontStyle: "bold",
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
