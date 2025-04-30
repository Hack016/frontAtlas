import { BASE_URL } from "../context/config";

export const getUserAvatar = (usuario) => {
  if (usuario?.foto_perfil) {
    const cleanBaseUrl = BASE_URL.slice(0, -1); // Quita el / al final de la URL para que no haya dos
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
