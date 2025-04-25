import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const changeProfilePicture = async ({
  setNuevaFoto,
  nuevaFoto,
  fotoPerfilOriginal,
  showActionSheetWithOptions,
}) => {
  const options = ["Take Photo", "Select Photo from Library"];
  const hasPhoto = nuevaFoto || fotoPerfilOriginal;

  if (hasPhoto) {
    options.push("Delete Profile Picture");
  }

  options.push("Cancel");
  const cancelButtonIndex = options.length - 1;

  showActionSheetWithOptions(
    {
      options: options,
      cancelButtonIndex,
    },
    async (buttonIndex) => {
      const selected = options[buttonIndex];

      if (selected === "Take Photo") {
        const permiso = await ImagePicker.requestCameraPermissionsAsync();
        if (!permiso.granted) {
          Alert.alert("Permiso denegado", "No se puede acceder a la cámara");
          return;
        }

        const resultado = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!resultado.canceled) {
          setNuevaFoto(resultado.assets[0].uri);
        }
      } else if (selected === "Select Photo from Library") {
        const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permiso.granted) {
          Alert.alert("Permiso denegado", "No se puede acceder a la galería");
          return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!resultado.canceled) {
          const asset = resultado.assets[0];
          const file = {
            uri: asset.uri,
            name: asset.fileName || "profile.png",
            type: asset.type || "image/png",
          };
          setNuevaFoto(file);
        }
      } else if (selected === "Delete Profile Picture") {
        setNuevaFoto(null);
      }
    }
  );
};
