import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { BASE_URL } from "../context/config";

export const useFetchWithAuth = () => {
  const { authTokens, logTokens, logout } = useContext(AuthContext);

  const fetchWithAuth = async (url, options = {}) => {
    let accessToken = authTokens?.access;

    const isFormData = options.body instanceof FormData; //Ver si se manda FormData en la petición

    let headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (options.headers) {
      headers = { ...headers, ...options.headers };
    }

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
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
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

      const response = await fetch(`${BASE_URL}api/token/refresh/`, {
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
