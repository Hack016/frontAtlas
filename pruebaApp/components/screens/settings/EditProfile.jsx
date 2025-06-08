import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { useFetchWithAuth } from "../../../utils/fetchWithAuth";
import { BASE_URL } from "../../../context/config";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { changeProfilePicture } from "./ChangeProfilePicture";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useNavigation } from "@react-navigation/native";
import { getUserAvatar } from "../../../utils/avatar";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export const EditProfile = () => {
  const navigation = useNavigation();
  const fetchWithAuth = useFetchWithAuth();
  const [profileData, setProfileData] = useState(null);
  const { showActionSheetWithOptions } = useActionSheet();

  const fetchProfileData = async () => {
    try {
      console.log(BASE_URL);
      const response = await fetchWithAuth(`${BASE_URL}api/editProfile/`, {
        method: "GET",
      });

      const data = await response.json();
      setProfileData(data);

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error || "Server not available" };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  React.useEffect(() => {
    fetchProfileData();
  }, []);

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaBio, setNuevaBio] = useState("");
  const [nuevoSexo, setNuevoSexo] = useState("Male");
  const [nuevaFecha, setNuevaFecha] = useState(null);
  const [nuevaFoto, setNuevaFoto] = useState(null);
  const [mostrarPickerFecha, setMostrarPickerFecha] = useState(false);

  useEffect(() => {
    // Este código solo se ejecuta cuando profileData cambia
    if (profileData) {
      setNuevoNombre(profileData.nombre || "");
      setNuevaBio(profileData.biografia || "");
      setNuevoSexo(profileData.sexo || "Male");
      setNuevaFecha(
        profileData.ano_nacimiento
          ? new Date(profileData.ano_nacimiento)
          : new Date()
      );
      setNuevaFoto(profileData.foto_perfil || "");
    }
  }, [profileData]);
  if (!profileData) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator color="white" size="small" />
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    const formData = new FormData();
    let hasChanges = false;

    // Ver qué campos enviar (solo los modificados por el usuario)
    if (nuevoNombre !== profileData.nombre) {
      formData.append("nombre", nuevoNombre);
      hasChanges = true;
    }

    if (nuevaBio !== profileData.biografia) {
      formData.append("biografia", nuevaBio);
      hasChanges = true;
    }

    if (nuevoSexo !== profileData.sexo) {
      formData.append("sexo", nuevoSexo);
      hasChanges = true;
    }

    const fechaOriginal = new Date(profileData.ano_nacimiento).toDateString();
    const fechaNueva = nuevaFecha?.toDateString();
    if (fechaNueva !== fechaOriginal) {
      formData.append("ano_nacimiento", nuevaFecha.toISOString().split("T")[0]);
      hasChanges = true;
    }

    // si hay una nueva foto (como archivo) distinta a la original
    if (
      nuevaFoto &&
      typeof nuevaFoto === "object" &&
      nuevaFoto.uri &&
      nuevaFoto.uri !== profileData.foto_perfil
    ) {
      if (nuevaFoto.uri.startsWith("file://")) {
        // Comprimir imagen para que sea válida y compatible
        const manipResult = await manipulateAsync(
          nuevaFoto.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: SaveFormat.PNG }
        );

        const file = {
          uri: manipResult.uri,
          name: "profile.png",
          type: "image/png",
        };

        formData.append("foto_perfil", file);
      } else {
        console.error("Imagen no válida", nuevaFoto);
        Alert.alert("Error", "La imagen seleccionada no es válida.");
        return;
      }
      hasChanges = true;
    }

    // Si se eliminó la foto
    if (!nuevaFoto && profileData.foto_perfil) {
      // formData.append("foto_perfil", ""); // Borraría la imagen también en el backend
      formData.append("eliminar_foto", "true"); // Enviaría un parámetro para que el backend elimine la imagen
      hasChanges = true;
    }

    // Si no hay nada para enviar
    if (!hasChanges) {
      Alert.alert("No changes made");
      return;
    }

    try {
      const response = await fetchWithAuth(`${BASE_URL}api/editProfile/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        const errorData = await response.json();
        console.log("Save error details:", errorData);

        Alert.alert("Error", errorData.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Save failed", error);
      Alert.alert("Error", "Network error.");
    }
  };

  const handleFechaChange = (event, selectedDate) => {
    const currentDate = selectedDate || nuevaFecha;
    setMostrarPickerFecha(false);
    setNuevaFecha(currentDate);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          source={
            nuevaFoto && nuevaFoto.uri
              ? { uri: nuevaFoto.uri }
              : getUserAvatar(profileData)
          }
          style={styles.fotoPerfil}
        />
        <Pressable
          onPress={() =>
            changeProfilePicture({
              setNuevaFoto,
              nuevaFoto,
              fotoPerfilOriginal: profileData.foto_perfil,
              showActionSheetWithOptions,
            })
          }
          style={({ pressed }) => [
            pressed
              ? { ...styles.botonCambiar, opacity: 0.6 }
              : styles.botonCambiar,
          ]}
        >
          <Text style={styles.botonTexto}>Cambiar foto de perfil</Text>
        </Pressable>

        <View style={styles.divider}></View>
        <View style={styles.filaName}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder={nuevoNombre !== "" ? nuevoNombre : "Name"}
            value={nuevoNombre}
            onChangeText={setNuevoNombre}
          />
        </View>

        <View style={styles.divider}></View>
        <View style={styles.filaBio}>
          <Text style={styles.label}>Bio:</Text>
          <TextInput
            style={styles.textArea}
            placeholder={nuevaBio !== "" ? nuevaBio : "Bio"}
            value={nuevaBio}
            onChangeText={setNuevaBio}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.divider}></View>
        <View style={styles.fila}>
          <Text style={styles.label}>Sexo:</Text>
          <Picker
            selectedValue={nuevoSexo}
            onValueChange={(itemValue) => setNuevoSexo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
        <View style={styles.divider}></View>

        <View style={styles.fila}>
          <Text style={styles.label}>Birthday:</Text>
          <Pressable onPress={() => setMostrarPickerFecha(true)}>
            <Text style={styles.fecha}>
              {nuevaFecha
                ? nuevaFecha.toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Select a date"}
            </Text>
          </Pressable>
        </View>

        {mostrarPickerFecha && (
          <DateTimePicker
            value={nuevaFecha}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={handleFechaChange}
          />
        )}

        <View style={styles.divider}></View>
        <Pressable
          onPress={handleSave}
          style={({ pressed }) =>
            pressed ? { ...styles.saveButton, opacity: 0.6 } : styles.saveButton
          }
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  fotoPerfil: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 10,
  },
  botonCambiar: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: "center",
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  textArea: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top",
    flex: 1,
    minHeight: 100,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "space-between",
  },
  filaName: {
    flexDirection: "row",
    paddingBottom: 20,
    alignItems: "center",
  },
  filaBio: {
    flexDirection: "row",
    paddingBottom: 20,
    alignItems: "flex-start",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    paddingRight: 30,
  },
  picker: {
    color: "#007bff",
    backgroundColor: "transparent",
    width: 150,
    marginLeft: 10,
    paddingVertical: 8,
    borderWidth: 0,
  },
  fecha: {
    fontSize: 16,
    color: "#007bff",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
