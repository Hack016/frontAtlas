import {
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
} from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { TextInput, ActivityIndicator } from "react-native-paper";
import { signInWithCredentials } from "../components/Signin";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export const LoginFunction = ({ navigation }) => {
  const { logTokens } = useContext(AuthContext);
  const [email, onChangeEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  //variables de error
  const [errorpassword, seterrorpassword] = React.useState("");
  const [erroremail, seterroremail] = React.useState("");
  const [errorgeneral, seterrorgeneral] = React.useState("");

  const validateEmailFormat = (email) => {
    // Expresión regular para validar el email
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  async function handleLogin(email, password) {
    seterroremail("");
    seterrorpassword("");
    seterrorgeneral("");
    let error = false;

    if (!email) {
      seterroremail("Email is required");
      error = true;
    } else if (!validateEmailFormat(email)) {
      seterroremail("Invalid email format");
      error = true;
    }

    if (!password) {
      seterrorpassword("Password is required");
      error = true;
    }

    if (error) {
      return;
    }

    setIsLoading(true);
    const result = await signInWithCredentials(email, password);
    setIsLoading(false);

    if (result.success) {
      // Guardar tokens en AsyncStorage
      const tokens = result.tokens;
      await logTokens(tokens);
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else {
      if (result.error === "Credenciales incorrectas") {
        seterrorgeneral("Login failed: Incorrect email or password");
      } else {
        seterrorgeneral("Login failed: Unexpected error, try again later");
      }
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require("../assets/TitanVectorizado.png")}
          style={styles.logo}
        />
        {erroremail !== "" && <Text style={styles.error}>{erroremail}</Text>}
        <TextInput
          style={styles.input}
          label="Email"
          onChangeText={onChangeEmail}
          value={email}
          keyboardType="email-address"
          mode="outlined"
          outlineColor="#007BFF"
          activeOutlineColor="#007BFF"
          activeUnderlineColor="#007BFF"
        />
        {errorpassword !== "" && (
          <Text style={styles.error}>{errorpassword}</Text>
        )}
        <TextInput
          style={styles.input}
          label="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={!showPassword}
          mode="outlined"
          outlineColor="#007BFF"
          activeOutlineColor="#007BFF"
          activeUnderlineColor="#007BFF"
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        <Pressable
          style={({ pressed }) =>
            pressed ? { ...styles.button, opacity: 0.5 } : styles.button
          }
          onPress={() => {
            handleLogin(email, password);
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </Pressable>
        {errorgeneral !== "" && (
          <Text style={styles.error}>{errorgeneral}</Text>
        )}
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
  error: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
