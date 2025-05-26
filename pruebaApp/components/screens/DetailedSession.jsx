import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { BASE_URL } from "../../context/config";
import { useRoute } from "@react-navigation/native";
import { ExerciseDisplayCard } from "../Cards/ExerciseDisplayCard";
import { getUserAvatar } from "../../utils/avatar";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { getConventionalName } from "../../utils/musclename_converter";

export const DetailedSessionScreen = () => {
  const fetchWithAuth = useFetchWithAuth();
  const navigation = useNavigation();
  const { authTokens } = React.useContext(AuthContext);
  const [sessionData, setSessionData] = useState(null);
  const route = useRoute();
  const { idSesion } = route.params;
  const [sets, setSets] = useState(0);

  const fetchSessionData = async () => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/getSessionDetail/?idSesion=${encodeURIComponent(idSesion)}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSessionData(data);
        const s = data.ejercicios.reduce(
          (total, ejercicio) => total + (ejercicio.series?.length || 0),
          0
        );
        setSets(s); //calcular los sets totales de la sesión
        return { success: true, data };
      } else {
        return { success: false, error: data.error || "Server not available" };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchSessionData();
  }, []);

  const calcularPorcentajeMuscular = (ejercicios) => {
    const cargaMuscular = {};

    ejercicios.forEach((ejercicio) => {
      const sets = ejercicio.series.length;

      // Cada ejercicio pondera 0.7 por set a principales y 0.3 a secundarios
      const cargaPorSetPrincipal = 0.7;
      const cargaPorSetSecundario = 0.3;

      // Suma a cada músculo principal
      ejercicio.musculos_principales.forEach((musculo) => {
        const carga = sets * cargaPorSetPrincipal;
        cargaMuscular[musculo] = (cargaMuscular[musculo] || 0) + carga;
      });

      // Suma a cada músculo secundario
      ejercicio.musculos_secundarios.forEach((musculo) => {
        const carga = sets * cargaPorSetSecundario;
        cargaMuscular[musculo] = (cargaMuscular[musculo] || 0) + carga;
      });
    });

    // Calcular total acumulado
    const total = Object.values(cargaMuscular).reduce(
      //Object.values(cargaMuscular) solo devuelve los valores de cada par clave-valor
      (acc, val) => acc + val,
      0
    );

    // Convertir a porcentajes
    const porcentajes = {};
    Object.entries(cargaMuscular).forEach(([musculo, carga]) => {
      porcentajes[musculo] = Math.round((carga / total) * 100); // 2 decimales
    });

    return porcentajes;
  };

  const MuscleBar = (
    { name, percent } //barra de porcentaje muscular
  ) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.muscleText}>{getConventionalName(name)}</Text>
      <View style={styles.muscleBarContainer}>
        <View style={[styles.muscleBar, { width: `${percent}%` }]} />
        <Text style={styles.musclepercentage}>{percent}%</Text>
      </View>
    </View>
  );

  if (!sessionData) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sessionCard}>
        <Pressable
          style={styles.userHeader}
          onPress={() => {
            if (sessionData.usuario.username === authTokens.username)
              navigation.navigate("Profile", {
                showHeaderButtons: false,
              });
            else
              navigation.navigate("VisitProfile", {
                username: sessionData.usuario.username,
                follow_status: sessionData.usuario.follow_status,
              });
          }}
        >
          <Image
            source={getUserAvatar(sessionData.usuario)}
            style={styles.image}
          />
          <View>
            <Text style={styles.userSession}>
              {sessionData.usuario.username}
            </Text>
            <Text style={styles.sessionDate}>
              {new Date(sessionData.fecha).toLocaleString()}
            </Text>
          </View>
        </Pressable>

        <Text style={styles.sessionTitle}>{sessionData.nombre}</Text>

        <View style={styles.sessionRow}>
          <Text style={[styles.sessionInfo, { marginRight: 20 }]}>Time:</Text>
          <Text style={styles.sessionInfo}>Volume:</Text>
          <Text style={styles.sessionInfo}>Sets:</Text>
        </View>
        <View style={styles.sessionRow}>
          <Text style={[styles.sessionInfoValue, { marginRight: 20 }]}>
            {Math.floor(sessionData.tiempo / 60)}h {sessionData.tiempo % 60}min
          </Text>
          <Text style={styles.sessionInfoValue}>{sessionData.volumen} kg</Text>
          <Text style={styles.sessionInfoValue}>{sets}</Text>
        </View>
      </View>

      <Text style={styles.workoutTitle}>Muscle distribution:</Text>
      <View style={{ padding: 16 }}>
        {Object.entries(calcularPorcentajeMuscular(sessionData.ejercicios)).map(
          ([musculo, porcentaje]) => (
            <MuscleBar key={musculo} name={musculo} percent={porcentaje} />
          )
        )}
      </View>
      <Text style={styles.workoutTitle}>Workout:</Text>

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
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  userSession: {
    fontWeight: "bold",
    fontSize: 16,
  },
  sessionDate: {
    fontSize: 14,
    color: "gray",
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 8,
  },
  sessionRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  sessionInfo: {
    width: "33%",
    fontSize: 14,
    color: "gray",
  },
  sessionInfoValue: {
    width: "33%",
    fontSize: 18,
    color: "black",
  },
  exerciseContainer: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  setText: {
    fontSize: 14,
    marginTop: 4,
    marginLeft: 12,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "grey",
    marginBottom: 20,
    marginLeft: 16,
  },
  muscleBar: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    marginRight: 4,
  },
  muscleBarContainer: {
    height: 20,
    backgroundColor: "transparent",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  muscleText: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  musclepercentage: {
    fontSize: 14,
    color: "grey",
    fontWeight: "bold",
  },
});
