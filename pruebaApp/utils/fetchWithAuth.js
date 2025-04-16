import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { atob } from "atob";

export const useFetchWithAuth = () => {
  const { authTokens, logTokens, logout } = useContext(AuthContext);

  function decodeJwt(token) {
    try {
      const base64Payload = token.split(".")[1];
      const payload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/")); //Decodifica el token de base64 para luego obtener el campo de expiración
      return JSON.parse(payload);
    } catch (e) {
      return null;
    }
  }

  const fetchWithAuth = async (url, options = {}) => {
    let accessToken = authTokens?.access;
    const decoded = decodeJwt(accessToken);

    if (decoded?.exp) {
      const now = Math.floor(Date.now() / 1000);
      const secondsLeft = decoded.exp - now;

      if (secondsLeft < 30) {
        let newTokens = await refreshToken();
        if (newTokens) {
          accessToken = newTokens.access;
        } else {
          console.log("Token unavailable");
          await logout();
          throw new Error("Token invalid or expired");
        }
      }
    }

    // Añadir Authorization header
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    let response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      let newTokens = await refreshToken();
      if (newTokens) {
        accessToken = newTokens.access;
        response = await fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        await logout();
        throw new Error("Token invalid or expired");
      }
    }

    return response;
  };

  const refreshToken = async () => {
    try {
      const refresh = authTokens?.refresh;

      const response = await fetch("http://localhost:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      // Si la respuesta no es OK, cerrar sesión
      if (!response.ok) {
        await logout();
        return null;
      }

      const data = await response.json(); // { access: '...' }
      const newTokens = {
        ...authTokens,
        access: data.access,
      };

      await AsyncStorage.setItem("authTokens", JSON.stringify(newTokens));
      logTokens(newTokens);
      return newTokens;
    } catch (e) {
      await logout(); // Cerrar sesión si hay fallo de red
      return null;
    }
  };

  return fetchWithAuth;
};
