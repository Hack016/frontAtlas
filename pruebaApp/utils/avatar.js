export const getUserAvatar = (usuario) => {
  if (usuario?.foto_perfil) {
    return { uri: usuario.foto_perfil };
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
