// import { Platform, Share } from "react-native";

// let branch;
// if (Platform.OS !== "web") {
//   branch = require("react-native-branch").default;
// }

// export const sharePost = async (idEjercicio) => {
//   if (Platform.OS === "web") {
//     alert("Compartir entrenos no está disponible en la versión web todavía.");
//     return;
//   }

//   if (!branch || typeof branch.createBranchUniversalObject !== "function") {
//     console.warn("Branch no está listo todavía.");
//     alert(
//       "La app aún se está iniciando. Intenta compartir de nuevo en unos segundos."
//     );
//     return;
//   }

//   try {
//     const buo = await branch.createBranchUniversalObject(
//       `idEjercicio/${idEjercicio}`,
//       {
//         title: "Entreno compartido 💪",
//         contentDescription: "Mira este entrenamiento increíble",
//         contentMetadata: {
//           customMetadata: {
//             idEjercicio,
//           },
//         },
//       }
//     );

//     const { url } = await buo.generateShortUrl();

//     await Share.share({
//       message: `¡Mira este entreno! ${url}`,
//     });
//   } catch (error) {
//     console.error("Error creating the link:", error);
//     alert("Hubo un problema al crear el enlace. Intenta de nuevo.");
//   }
// };
