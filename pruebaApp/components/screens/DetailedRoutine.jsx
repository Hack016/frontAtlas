import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { BASE_URL } from "../../context/config";
import { useRoute } from "@react-navigation/native";
import { ExerciseDisplayCard } from "../Cards/ExerciseDisplayCard";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";

export const DetailedRoutineScreen = () => {
  const fetchWithAuth = useFetchWithAuth();
  const navigation = useNavigation();
  const { authTokens } = React.useContext(AuthContext);
  const [sessionData, setSessionData] = useState(null);
  const route = useRoute();
  const { idRutina } = route.params;

  const fetchRoutineData = async () => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/getroutineDetail/?idRutina=${encodeURIComponent(idRutina)}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSessionData(data);
        return { success: true, data };
      } else {
        return { success: false, error: data.error || "Server not available" };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchRoutineData();
  }, []);

  if (!sessionData) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sessionCard}>
        <Text style={styles.sessionTitle}>{sessionData.nombre}</Text>

        <Text style={styles.userSession}>Created by {authTokens.username}</Text>

        <Pressable
          style={({ pressed }) => [
            styles.startRoutineButton,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => {
            navigation.reset({
              // resetea la pila de navegación para que no se pueda volver a la pantalla anterior, y que pueda volver a Train si le pulsa atrás
              index: 1,
              routes: [
                {
                  name: "Home",
                  params: {
                    screen: "Train", //vuelve a la pantalla Train, si no pusiera nada cargaría HomeFeed
                  },
                },
                { name: "Workout Session", params: { rutina: sessionData } }, //Le paso la rutina por parámetro al workout session
              ],
            });
          }}
        >
          <Text style={styles.textRoutineButton}>Start Routine</Text>
        </Pressable>
      </View>

      <Text style={styles.workoutTitle}>Exercises:</Text>

      {sessionData.ejercicios.map((ej) => (
        <ExerciseDisplayCard key={ej.idEjercicio} ejercicio={ej} /> //llamo al displayCard para no meter todo el código aquí
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  sessionCard: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 20,
  },
  userSession: {
    fontSize: 16,
    color: "grey",
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 8,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "grey",
    marginBottom: 20,
    marginLeft: 16,
  },
  startRoutineButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: "90%",
  },
  textRoutineButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
