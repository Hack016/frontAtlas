import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
// import { signInWithGoogle } from "../components/Signin";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export const LoginScreen = ({ navigation }) => {
  // async function handleGoogleLogin() {
  //   setLoading(true);
  //   const result = await signInWithGoogle();
  //   setLoading(false);

  //   if (result.success) {
  //     setMessage(JSON.stringify(result.data, null, 2));
  //   } else {
  //     setMessage(`Error: ${JSON.stringify(result.error, null, 2)}`);
  //   }
  // }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo en el centro */}
        <Image
          source={require("../assets/TitanVectorizado.png")}
          style={styles.logo}
        />

        <Text style={styles.appname}>Atlas Gym Tracker</Text>
        <Text style={styles.text}>
          "Forge your strength, track your legacy"
        </Text>

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
            onPress={() => {
              navigation.navigate("RegisterForm");
            }}
          >
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>

          {/* <Pressable
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
                <Icon
                  name="google"
                  size={20}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>Log in with Google</Text>
              </>
            )}
          </Pressable> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 0,
  },
  appname: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "cursive",
    marginVertical: 10,
  },
  text: {
    fontSize: 20,
    marginVertical: 10,
    fontFamily: "seriff",
    fontStyle: "italic",
  },
  buttonContainer: {
    width: "80%",
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
