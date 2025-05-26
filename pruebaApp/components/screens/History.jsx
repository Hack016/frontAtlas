import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, FlatList, RefreshControl, View, Text } from "react-native";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { ExerciseDisplayCard } from "../Cards/ExerciseDisplayCard";
import { useRoute } from "@react-navigation/native";
import { BASE_URL } from "../../context/config";
import { Entypo } from "react-native-vector-icons";
const LIMIT = 5;

export default function HistoryExerciseScreen() {
  const fetchWithAuth = useFetchWithAuth();
  const route = useRoute();
  const { idEjercicio } = route.params;
  const [sessions, setSessions] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [initialLoadDone, setInitialLoadDone] = React.useState(false);

  const fetchSessions = async (initial = false) => {
    if (loadingMore || (!initial && !hasMore)) return;

    if (initial) {
      setRefreshing(true);
      setOffset(0);
      setHasMore(true);
    } else {
      if (!initialLoadDone) return;
      setLoadingMore(true);
    }
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/ejercicio/${idEjercicio}/history/?limit=${LIMIT}&offset=${initial ? 0 : offset}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (initial) {
          setSessions(data.results);
          setInitialLoadDone(true);
        } else {
          setSessions((prev) => {
            const existingIds = new Set(prev.map((s) => s.idSesion));
            const deduplicated = data.results.filter(
              (s) => !existingIds.has(s.idSesion)
            );
            return [...prev, ...deduplicated];
          });
        }
        setOffset((prev) => prev + LIMIT);
        if (data.results.length < LIMIT) {
          setHasMore(false);
        }
      } else {
        return { success: false, error: data.error || "Server not available" };
      }
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSessions(true);
    setRefreshing(false);
  };

  React.useEffect(() => {
    onRefresh();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={sessions}
        renderItem={({ item }) => (
          <ExerciseDisplayCard key={item.idSesion} ejercicio={item} />
        )}
        keyExtractor={(item) => item.idSesion.toString()}
        onEndReached={() => {
          fetchSessions(false);
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.noExerciseMessageContainer}>
            <Entypo name="back-in-time" size={45} color={"grey"} />
            <Text style={styles.noExercisesText}>No exercise history yet</Text>
            <Text style={styles.noExercisesText2}>
              Log a workout with this exercise and see your history here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  sesionTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  fecha: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  ejercicioTitulo: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 4,
    color: "black",
  },
  serieRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  tipo: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
    marginRight: 8,
  },
  pesoReps: {
    fontSize: 14,
    color: "#333",
  },
  textoTipo: {
    fontSize: 14,
    color: "#777",
    marginRight: 8,
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
  noExercisesText2: {
    color: "grey",
    fontSize: 13,
    marginBottom: 12,
  },
});
