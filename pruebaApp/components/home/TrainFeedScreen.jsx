import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  RefreshControl,
  Image,
} from "react-native";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";

export default function TrainFeedScreen() {
  const fetchWithAuth = useFetchWithAuth();

  const [exercises, setExercises] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchExercises = async () => {
    try {
      setRefreshing(true);
      const response = await fetchWithAuth(
        "http://localhost:8000/api/EjercicioFeed/",
        {
          method: "GET",
        }
      );
      // const response = await fetch("http://localhost:8000/api/EjercicioFeed/", {
      //   method: "GET",
      // });
      setRefreshing(false);

      const data = await response.json();
      setExercises(data);

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
    fetchExercises();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchExercises} /> // RefresControl es para deslizar hacia abajo y recargar
        }
      >
        {exercises.map((item) => (
          <View key={item.idEjercicio} style={styles.card}>
            {item.imagen && (
              <Image source={{ uri: item.imagen }} style={styles.image} />
            )}
            <View style={styles.textContainer}>
              <Text style={styles.exerciseName}>{item.nombre}</Text>
              <Text style={styles.muscleGroup}>
                Músculos: {item.musculos_principales.join(", ")}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  card: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white", // fondo oscuro
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
  textContainer: {
    flexDirection: "column",
  },
  exerciseName: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  muscleGroup: {
    color: "#aaa",
    fontSize: 14,
  },
});
