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
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../context/config";
import { Entypo } from "react-native-vector-icons";
import { getExerciseImageUrl } from "../../utils/avatar";
import { getConventionalName } from "../../utils/musclename_converter";
import { MaterialIcons, FontAwesome6 } from "@expo/vector-icons";

const LIMIT = 20; // Define cuantos ejs se cargan por página

export default function TrainFeedScreen() {
  const navigation = useNavigation();

  const fetchWithAuth = useFetchWithAuth();

  const [exercises, setExercises] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [initialLoadDone, setInitialLoadDone] = React.useState(false); //Bloquear onEndReached hasta que se carguen los datos iniciales

  //variables de search bar
  const [loading, setLoading] = React.useState(false);
  const [exerciseSearch, setExerciseSearch] = React.useState("");
  const [results, setResults] = React.useState([]);

  const fetchExercises = async (initial = false) => {
    try {
      if (loadingMore || (!initial && !hasMore)) return;

      if (initial) {
        setOffset(0);
        setHasMore(true);
        setRefreshing(true);
      } else {
        if (!initialLoadDone) return;
        setLoadingMore(true);
      }

      const response = await fetchWithAuth(
        `${BASE_URL}api/EjercicioFeed/?limit=${LIMIT}&offset=${initial ? 0 : offset}`
      );

      const data = await response.json();

      if (response.ok) {
        if (initial) {
          setExercises(data.results);
          setInitialLoadDone(true);
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

  const searchExercises = async () => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/searchExercises/?exercisename=${encodeURIComponent(exerciseSearch)}`,
        { method: "GET" }
      );

      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
      } else {
        console.error("Error en el servidor");
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  React.useEffect(() => {
    fetchExercises(true);
  }, []);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (exerciseSearch.trim().length > 2) {
        setLoading(true);
        searchExercises().finally(() => setLoading(false));
      } else {
        setResults([]);
      }
    }, 1000); // una vez que escribe el ultimo caracter espera 1000 ms

    return () => clearTimeout(timeout); // limpia si el usuario sigue escribiendo
  }, [exerciseSearch]);

  const renderItem = ({ item }) => (
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
            <Image
              source={getExerciseImageUrl(item.imagen)}
              style={styles.image}
            />
          )}
          <View style={styles.textContainer}>
            <Text style={styles.exerciseName}>{item.nombre}</Text>
            <Text style={styles.muscleGroup}>
              Músculos:{" "}
              {item.musculos_principales
                .map((name) => {
                  const conventional = getConventionalName(name);
                  return `${conventional} (${name})`;
                })
                .join(", ")}
            </Text>
          </View>
        </View>
        <Entypo name="chevron-right" size={24} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.searchBarContainer}>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <MaterialIcons name="search" size={24} style={styles.icon} />
        )}
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises in Atlas"
          placeholderTextColor="#CDCDCD"
          value={exerciseSearch}
          onChangeText={setExerciseSearch}
        />
      </View>
      <FlatList
        data={exerciseSearch.trim().length > 2 ? results : exercises}
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
        ListEmptyComponent={
          <View style={styles.noExerciseMessageContainer}>
            <FontAwesome6 name="dumbbell" size={45} color={"grey"} />
            <Text style={styles.noExercisesText}>
              There were no matches with the given query
            </Text>
          </View>
        }
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
  searchBarContainer: {
    flexDirection: "row",
    alignSelf: "center",
    width: "98%",
    marginTop: 8,
    alignItems: "center",
    height: 40,
    borderColor: "#ccc",
    backgroundColor: "grey",
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 10,
  },
  searchInput: {
    height: 40,
    flex: 1,
    marginLeft: 10,
    color: "white",
    backgroundColor: "transparent",
    underlineColorAndroid: "transparent",
    outlineStyle: "none",
  },
  icon: {
    color: "white",
  },
  noExerciseMessageContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  noExercisesText: {
    fontSize: 15,
    marginBottom: 8,
    marginTop: 12,
    fontWeight: "bold",
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
