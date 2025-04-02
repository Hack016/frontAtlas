import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { signInWithGoogle } from "../components/Signin";

const { width } = Dimensions.get("window");

export const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleGoogleLogin() {
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);

    if (result.success) {
      setMessage(JSON.stringify(result.data, null, 2));
    } else {
      setMessage(`Error: ${JSON.stringify(result.error, null, 2)}`);
    }
  }
  return (
    <View style={styles.container}>
      {/* Logo en el centro */}
      <Image
        source={require("../assets/TitanVectorizado.png")}
        style={styles.logo}
      />

      <Text style={styles.appname}>Atlas Gym Tracker</Text>
      <Text style={styles.text}>"Forge your strength, track your legacy"</Text>

      {/* Botones de acción */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) =>
            pressed ? { ...styles.button, opacity: 0.5 } : styles.button
          }
          onPress={() => {
            navigation.navigate("LoginForm");
          }}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) =>
            pressed ? { ...styles.button, opacity: 0.5 } : styles.button
          }
        >
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) =>
            pressed
              ? { ...styles.googleButton, opacity: 0.5 }
              : styles.googleButton
          }
          onPress={handleGoogleLogin}
        >
          {loading ? (
            <Text style={styles.text}>Logging in</Text>
          ) : (
            <>
              <Icon name="google" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Log in with Google</Text>
            </>
          )}
        </Pressable>
      </View>
      {/*Mensaje de éxito o error */}
      {message && (
        <View style={{ marginTop: 20 }}>
          <Text>{message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 10,
  },
  appname: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "cursive",
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    marginBottom: 200,
    fontFamily: "seriff",
    fontStyle: "italic",
  },
  buttonContainer: {
    width: "80%",
    position: "absolute",
    bottom: 50,
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
  googleButton: {
    backgroundColor: "#DB4437",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  icon: {
    marginRight: 10,
    alignSelf: "center",
  },
});
