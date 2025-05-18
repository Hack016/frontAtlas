import {
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
} from "react-native";
import { TextInput, ActivityIndicator } from "react-native-paper";
// import { AuthContext } from "../context/AuthContext";
import React from "react";
import { registerWithCredentials } from "../components/Signin";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export const RegisterFunction = ({ navigation }) => {
  // const { logTokens } = useContext(AuthContext);
  const [email, onChangeEmail] = React.useState("");
  const [nombre, onChangeNombre] = React.useState("");
  const [username, onChangeUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordRepeated, setPasswordRepeated] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordRepeated, setShowPasswordRepeated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  //variables de error
  const [errorpassword, seterrorpassword] = React.useState("");
  const [erroremail, seterroremail] = React.useState("");
  const [errorusername, seterrorusername] = React.useState("");
  const [errorname, seterrorname] = React.useState("");
  const [errorgeneral, seterrorgeneral] = React.useState("");

  const validateEmailFormat = (email) => {
    // Expresión regular para validar el email
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  async function handleRegister(email, username, name, password) {
    // Limpiar los mensajes de error
    seterrorpassword("");
    seterroremail("");
    seterrorusername("");
    seterrorgeneral("");
    seterrorname("");
    let error = false;

    if (!email) {
      seterroremail("Email is required");
      error = true;
    } else if (!validateEmailFormat(email)) {
      seterroremail("Invalid email format");
      error = true;
    }

    if (!username) {
      seterrorusername("Username is required");
      error = true;
    }

    if (!name) {
      seterrorname("Name is required");
      error = true;
    }

    if (!password) {
      seterrorpassword("Password is required");
      error = true;
    }

    if (!passwordRepeated) {
      seterrorpassword("Please repeat your password");
      error = true;
    } else if (password !== passwordRepeated) {
      seterrorpassword("Passwords do not match");
      error = true;
    }

    if (error) {
      return;
    }

    setIsLoading(true);
    const result = await registerWithCredentials(
      email,
      username,
      name,
      password
    );
    setIsLoading(false);

    if (result.success) {
      // Guardar tokens en AsyncStorage, NO guardarlos aquí porque sino nos redirige directamente a Home y queremos que muestre una pantalla antes
      const tokens = result.tokens;
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "OptionalInfo",
            params: { nombreUsuario: nombre, tokens: tokens },
          },
        ],
      });
    } else {
      if (result.error === "This email is already registered.") {
        seterroremail("This email is already registered.");
      } else if (result.error === "The username is already in use.") {
        seterrorusername("The username is already in use.");
      } else if (
        result.error ===
        "This password must contain:\n - at least 1 digit\n - at least 1 upper case letter\n - at least 1 special character"
      ) {
        seterrorpassword(
          "This password must contain:\n - at least 1 digit\n - at least 1 upper case letter\n - at least 1 special character \n - at least 8 characters"
        );
      } else {
        seterrorgeneral("Failed to register, try again later.");
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
        {errorusername !== "" && (
          <Text style={styles.error}>{errorusername}</Text>
        )}
        <TextInput
          style={styles.input}
          label="Username"
          onChangeText={onChangeUsername}
          value={username}
          mode="outlined"
          outlineColor="#007BFF"
          activeOutlineColor="#007BFF"
          activeUnderlineColor="#007BFF"
        />
        {errorname !== "" && <Text style={styles.error}>{errorname}</Text>}
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
        {errorpassword !== "" && (
          <Text style={styles.error}>{errorpassword}</Text>
        )}
        <TextInput
          style={styles.input}
          label="Repeat Password"
          onChangeText={setPasswordRepeated}
          value={passwordRepeated}
          secureTextEntry={!showPasswordRepeated}
          mode="outlined"
          outlineColor="#007BFF"
          activeOutlineColor="#007BFF"
          activeUnderlineColor="#007BFF"
          right={
            <TextInput.Icon
              icon={showPasswordRepeated ? "eye-off" : "eye"}
              onPress={() => setShowPasswordRepeated(!showPasswordRepeated)}
            />
          }
        />
        <Pressable
          disabled={isLoading}
          style={({ pressed }) =>
            pressed ? { ...styles.button, opacity: 0.5 } : styles.button
          }
          onPress={() => {
            handleRegister(email, username, nombre, password);
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
