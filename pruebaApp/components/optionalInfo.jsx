import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BASE_URL } from "../context/config";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const OptionalInfo = () => {
  const { logTokens } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { nombreUsuario, tokens } = route.params;

  const [sexo, setSexo] = useState("Please, select a gender:");
  const [bio, setBio] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [errorSex, setErrorSex] = useState("");
  const fetchWithGivenToken = async (url, options = {}) => {
    const isFormData = options.body instanceof FormData;

    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${tokens.access}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    return await fetch(url, {
      ...options,
      headers,
    });
  };

  async function handleSave(sexo, bio, fechaNacimiento) {
    //Limpio error
    setErrorSex("");
    let error = false;

    if (sexo === "Please, select a gender:") {
      setErrorSex("Please, select a gender:");
      error = true;
    }
    if (error) {
      return;
    }
    const formData = new FormData();
    formData.append("sexo", sexo);
    formData.append("biografia", bio);
    formData.append(
      "ano_nacimiento",
      fechaNacimiento.toISOString().split("T")[0]
    );

    try {
      const response = await fetchWithGivenToken(
        `${BASE_URL}api/editProfile/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        await logTokens(tokens);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error saving profile.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/AtlasSentadilla2.png")}
          style={styles.headerBackground}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.welcomeTitle}>
              Welcome to Atlas, {nombreUsuario}!
            </Text>
            <Text style={styles.welcomeSubtitle}>
              A world rests on your shoulders. Rise and claim your destiny.{" "}
              {"\n"}
              Complete a few more steps and you're all set up to start your
              journey!
            </Text>
          </View>
          {errorSex !== "" && <Text style={styles.error}>{errorSex}</Text>}
          <View style={styles.fila}>
            <Text style={styles.label}>Sex:</Text>
            <Picker
              selectedValue={sexo}
              onValueChange={(itemValue) => setSexo(itemValue)}
              style={styles.picker}
            >
              <Picker.Item
                label="Please, select a gender:"
                value="Please, select a gender:"
              />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <TextInput
            style={styles.textArea}
            label="Biography (optional)"
            onChangeText={setBio}
            value={bio}
            mode="outlined"
            outlineColor="#007BFF"
            activeOutlineColor="#007BFF"
            activeUnderlineColor="#007BFF"
            theme={{ colors: { text: "white", placeholder: "#ccc" } }}
          />

          <View style={styles.fila}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Pressable onPress={() => setMostrarDatePicker(true)}>
              <Text style={styles.fecha}>
                {fechaNacimiento.toLocaleDateString()}
              </Text>
            </Pressable>

            {mostrarDatePicker && (
              <DateTimePicker
                value={fechaNacimiento}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setMostrarDatePicker(false);
                  if (selectedDate) setFechaNacimiento(selectedDate);
                }}
              />
            )}
          </View>

          <Pressable
            style={styles.saveButton}
            onPress={() => handleSave(sexo, bio, fechaNacimiento)}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "center",
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    color: "white",
    marginBottom: 30,
    maxWidth: "85%",
    alignSelf: "center",
  },
  label: { fontSize: 18, marginVertical: 10, color: "#007BFF" },
  picker: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    marginVertical: 10,
    paddingHorizontal: 10,
    height: 50,
    width: "80%",
    alignSelf: "center",
    color: "white",
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "space-between",
  },
  textArea: {
    borderRadius: 10,
    padding: 10,
    minHeight: 100,
    marginBottom: 20,
    width: "80%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  fecha: {
    fontSize: 16,
    color: "white",
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  headerBackground: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 20,
    borderRadius: 10,
  },
});
