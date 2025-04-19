import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  RefreshControl,
  Image,
  Pressable,
} from "react-native";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../context/config";

export default function TrainFeedScreen() {
  const navigation = useNavigation();

  const fetchWithAuth = useFetchWithAuth();

  const [exercises, setExercises] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchExercises = async () => {
    try {
      setRefreshing(true);
      console.log(BASE_URL);
      const response = await fetchWithAuth(`${BASE_URL}api/EjercicioFeed/`, {
        method: "GET",
      });

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
          <Pressable
            key={item.idEjercicio}
            style={styles.card}
            onPress={() =>
              navigation.navigate("ExerciseDetail", {
                idEjercicio: item.idEjercicio,
                nombreEjercicio: item.nombre, // Le paso el nombre para que el titulo de la página sea el nombre del ejercicio
              })
            }
          >
            {item.imagen && (
              <Image source={{ uri: item.imagen }} style={styles.image} />
            )}
            <View style={styles.textContainer}>
              <Text style={styles.exerciseName}>{item.nombre}</Text>
              <Text style={styles.muscleGroup}>
                Músculos: {item.musculos_principales.join(", ")}
              </Text>
            </View>
          </Pressable>
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
    backgroundColor: "white",
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
