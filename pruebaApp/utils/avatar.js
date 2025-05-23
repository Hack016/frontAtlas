import { BASE_URL } from "../context/config";

export const getUserAvatar = (usuario) => {
  if (usuario?.foto_perfil) {
    // Si la URL ya es absoluta, úsala directamente
    if (usuario.foto_perfil.startsWith("http")) {
      return { uri: usuario.foto_perfil };
    }

    // Si es relativa, prepéndele la base limpia
    const cleanBaseUrl = BASE_URL.endsWith("/")
      ? BASE_URL.slice(0, -1)
      : BASE_URL;

    return { uri: `${cleanBaseUrl}${usuario.foto_perfil}` };
  }
  if (usuario?.sexo === "Male") {
    return require("../assets/Default_man.png");
  }
  if (usuario?.sexo === "Female") {
    return require("../assets/Default_woman.png");
  }
  if (usuario?.sexo === "Other") {
    return require("../assets/Default_Other.png");
  }
  return require("../assets/TitanVectorizado.png");
};

export const getExerciseImageUrl = (imagen) => {
  if (!imagen) return null;

  if (imagen.startsWith("http")) {
    return { uri: imagen };
  }

  const cleanBaseUrl = BASE_URL.endsWith("/")
    ? BASE_URL.slice(0, -1)
    : BASE_URL;

  return { uri: `${cleanBaseUrl}${imagen}` };
};
