import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
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
import { Entypo } from "react-native-vector-icons";

const LIMIT = 20; // Define cuantos ejs se cargan por página

export default function TrainFeedScreen() {
  const navigation = useNavigation();

  const fetchWithAuth = useFetchWithAuth();

  const [exercises, setExercises] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);

  const fetchExercises = async (initial = false) => {
    try {
      if (loadingMore || (!initial && !hasMore)) return;

      if (initial) {
        setOffset(0);
        setHasMore(true);
        setRefreshing(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetchWithAuth(
        `${BASE_URL}api/EjercicioFeed/?limit=${LIMIT}&offset=${initial ? 0 : offset}`
      );

      const data = await response.json();

      if (response.ok) {
        if (initial) {
          setExercises(data.results);
        } else {
          // setExercises((prev) => [...prev, ...data.results]);
          setExercises((prev) => {
            //Evita agregar ejercicios duplicados
            const newItems = data.results.filter(
              (item) => !prev.some((e) => e.idEjercicio === item.idEjercicio)
            );
            return [...prev, ...newItems];
          });
        }

        setOffset((prev) => prev + LIMIT);
        if (data.results.length < LIMIT) setHasMore(false); // No hay más datos
      } else {
        console.error("Failed: server error");
      }
    } catch (error) {
      console.error("Failed to fetch exercises", error);
    } finally {
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchExercises(true);
  }, []);

  const renderItem = (
    { item } // Renderiza cada ejercicio, lo hago en función a parte para que el código esté más limpio
  ) => (
    <View style={styles.cardEnvelope}>
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate("ExerciseDetail", {
            idEjercicio: item.idEjercicio,
            nombreEjercicio: item.nombre, // Le paso el nombre para que el titulo de la página sea el nombre del ejercicio
          })
        }
      >
        <View style={styles.exercisecontainer}>
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
        <Entypo name="chevron-right" size={24} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={(item) => item.idEjercicio.toString()}
        onEndReached={() => fetchExercises(false)}
        onEndReachedThreshold={0.5} // Carga más cuando estás al 50% del final
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchExercises(true)}
          />
        }
        contentContainerStyle={styles.scrollContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardEnvelope: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    justifyContent: "space-between",
  },
  exercisecontainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Ocupa el espacio para empujar el ícono al final
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
