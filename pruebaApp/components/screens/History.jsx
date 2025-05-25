import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, FlatList, RefreshControl } from "react-native";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { ExerciseDisplayCard } from "../Cards/ExerciseDisplayCard";
import { useRoute } from "@react-navigation/native";
import { BASE_URL } from "../../context/config";
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
      // const raw = await response.text();
      // console.log("🧪 RAW:", raw); // esto debería mostrar el JSON completo
      // const data = JSON.parse(raw);
      // setSessions(data.results);

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
      {/* <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchSessions} /> // RefresControl es para deslizar hacia abajo y recargar
        }
      >
        {sessions.map((item) => (
          <ExerciseDisplayCard key={item.idSesion} ejercicio={item} />
        ))}
      </ScrollView> */}
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
});
