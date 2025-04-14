import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar tokens desde AsyncStorage, cuando importas algo de AuthContext, se ejecuta automaticamente
  useEffect(() => {
    const loadTokens = async () => {
      try {
        const storedTokens = await AsyncStorage.getItem("authTokens");
        if (storedTokens) {
          setAuthTokens(JSON.parse(storedTokens));
        }
      } catch (e) {
        console.error("Error loading tokens from storage", e);
      } finally {
        setLoading(false);
      }
    };
    loadTokens();
  }, []);

  // Guardar tokens en AsyncStorage
  const logTokens = async (tokens) => {
    try {
      await AsyncStorage.setItem("authTokens", JSON.stringify(tokens));
      setAuthTokens(tokens);
    } catch (e) {
      console.error("Error saving tokens to storage", e);
    }
  };

  // Función para eliminar tokens (logout), se supone que al eliminar del contexto los tokens te redirige a la pantalla login
  const logout = async () => {
    await AsyncStorage.removeItem("authTokens");
    setAuthTokens(null);
  };

  return (
    <AuthContext.Provider value={{ authTokens, logTokens, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
