// import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { BASE_URL } from "../context/config";

// GoogleSignin.configure({
//   webClientId:
//     "856828417742-gml9ffcb68pfu40b58fcfhpu5m3mdld5.apps.googleusercontent.com", // Desde Google Cloud Console
// });
// export async function signInWithGoogle() {
//   try {
//     await GoogleSignin.hasPlayServices();
//     const userInfo = await GoogleSignin.signIn();
//     const idToken = userInfo.idToken; // Este es el token que enviamos a Django

//     // Ahora enviamos este ID Token al backend para autenticar
//     const response = await fetch(`${BASE_URL}api/login/google/`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ token: idToken }),
//     });

//     const data = await response.json();
//     return { success: true, data };
//     // Mostrar respuesta del backend o error en caso de que falle
//   } catch (error) {
//     return { success: false, error };
//   }
// }

export async function signInWithCredentials(email, password) {
  try {
    const response = await fetch(`${BASE_URL}api/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    const tokens = await response.json();

    if (response.ok) {
      return { success: true, tokens };
    } else {
      return { success: false, error: tokens.error || "Login Failed" };
    }
  } catch (error) {
    return { success: false, error };
  }
}

export async function registerWithCredentials(email, username, name, password) {
  try {
    const response = await fetch(`${BASE_URL}api/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        nombre: name,
        password: password,
      }),
    });

    const tokens = await response.json();

    if (response.ok) {
      return { success: true, tokens };
    } else {
      return { success: false, error: tokens.error || "Register Failed" };
    }
  } catch (error) {
    return { success: false, error };
  }
}
