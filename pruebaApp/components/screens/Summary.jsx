import {
  View,
  FlatList,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { BASE_URL } from "../../context/config";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { getExerciseImageUrl } from "../../utils/avatar";

const { width: screenWidth } = Dimensions.get("window");

export default function Summary() {
  const fetchWithAuth = useFetchWithAuth();

  const [ejercicio, setEjercicio] = React.useState([]);
  const { params } = useRoute();
  const idEjercicio = params?.idEjercicio;

  const fetchEjercicio = async () => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/ejercicio/${idEjercicio}/summary/`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setEjercicio(data);

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error || "Server not available" };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  React.useEffect(() => {
    fetchEjercicio();
  }, []);

  if (!ejercicio) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={getExerciseImageUrl(ejercicio.imagen)}
          style={styles.image}
        />
        <Text style={styles.title}>{ejercicio.nombre}</Text>
        <View style={styles.container}>
          {ejercicio?.musculos_principales && (
            <Text style={styles.muscles}>
              Main muscles: {ejercicio.musculos_principales.join(", ")}
            </Text>
          )}
          {ejercicio?.musculos_secundarios &&
            ejercicio.musculos_secundarios.length > 0 && (
              <Text style={styles.muscles}>
                Secondary muscles: {ejercicio.musculos_secundarios.join(", ")}
              </Text>
            )}
          <Text style={styles.titlestats}>Personal Records</Text>

          <View style={styles.row}>
            <Text style={styles.statsText}>Best Weight</Text>
            <Text style={styles.stats}>
              {ejercicio?.estadisticas
                ? ejercicio?.estadisticas?.mayor_peso + "kg"
                : "---"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.statsText}>Best Set</Text>
            <Text style={styles.stats}>
              {ejercicio?.estadisticas
                ? ejercicio?.estadisticas?.mejor_serie.peso +
                  "kg" +
                  " x " +
                  ejercicio?.estadisticas?.mejor_serie.repeticiones
                : "---"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.statsText}>
              Best volume in a single Session
            </Text>
            <Text style={styles.stats}>
              {ejercicio?.estadisticas
                ? ejercicio?.estadisticas?.mayor_volumen_sesion + "kg"
                : "---"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 20,
  },
  swiper: {
    height: 250,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  image: {
    width: screenWidth,
    height: 250,
    resizeMode: "contain",
  },
  title: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  muscles: {
    fontSize: 14,
    color: "gray",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#007bff",
  },
  titlestats: {
    color: "gray",
    fontWeight: "bold",
    paddingTop: 20,
  },
  statsText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
  },
  stats: {
    color: "#2196F3",
    fontWeight: "bold",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
});
