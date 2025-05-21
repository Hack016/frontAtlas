import { Platform, Share } from "react-native";

let branch;
if (Platform.OS !== "web") {
  branch = require("react-native-branch").default;
}

export const sharePost = async (idEjercicio) => {
  if (Platform.OS === "web") {
    alert("Compartir entrenos no está disponible en la versión web todavía.");
    return;
  }

  try {
    const buo = await branch.createBranchUniversalObject(
      `idEjercicio/${idEjercicio}`,
      {
        title: "First workout post shared",
        contentDescription:
          "This is the description where I should put info about the app",
        contentMetadata: {
          customMetadata: {
            idEjercicio,
          },
        },
      }
    );

    const { url } = await buo.generateShortUrl();

    await Share.share({
      message: `¡Check out my first workout! ${url}`,
    });
  } catch (error) {
    console.error("Error creating the link:", error);
  }
};
