import React, { useContext, useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { ResumeWorkoutAS } from "../../utils/ResumeWorkoutAS";
import { WorkoutTimeContext } from "../../context/WorkoutTimeContext";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { BASE_URL } from "../../context/config";
import { SessionCard } from "../Cards/SessionCard";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
const LIMIT = 5;

export default function HomeFeedScreen() {
  const fetchWithAuth = useFetchWithAuth();
  const { isWorkoutActive } = useContext(WorkoutTimeContext);
  const [sessionsData, setSessionsData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();
  const [offset, setOffset] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [initialLoadDone, setInitialLoadDone] = React.useState(false); //Bloquear onEndReached hasta que se carguen los datos iniciales

  const fetchSessionsData = async (initial = false) => {
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
        `${BASE_URL}api/mainfeed/?limit=${LIMIT}&offset=${initial ? 0 : offset}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (initial) {
          setSessionsData(data.results);
          setInitialLoadDone(true);
        } else {
          // evitar mostrar usuarios duplicados
          setSessionsData((prev) => {
            const existingIds = new Set(prev.map((s) => s.idSesion));
            const deduplicated = data.results.filter(
              (item) => !existingIds.has(item.idSesion)
            );
            return [...prev, ...deduplicated];
          });
        }
        setOffset((prev) => prev + LIMIT);
        if (data.results.length < LIMIT) setHasMore(false);
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

  const handleDeleteLocalSession = (idSesion) => {
    setSessionsData((prev) => prev.filter((s) => s.idSesion !== idSesion));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSessionsData(true);
    setRefreshing(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLargeTitle: true,
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate("SearchUsers")}
          style={{ marginRight: 15 }}
        >
          <Ionicons name="search" size={24} color="black" />
        </Pressable>
      ),
    });
  }, []);

  React.useEffect(() => {
    onRefresh();
  }, []);

  if (!sessionsData) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator color="black" size="large" />
      </SafeAreaView>
    );
  }

  const renderSessionItem = ({ item }) => (
    <SessionCard item={item} onDeleteSession={handleDeleteLocalSession} />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={sessionsData}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.idSesion.toString()}
        onEndReached={() => {
          fetchSessionsData(false);
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome6 name="dumbbell" size={90} color={"gray"} />
            <Text style={styles.nullMessage}>
              No recent activity to show. Follow someone or start a new
              workout!!
            </Text>
          </View>
        }
      />
      {isWorkoutActive && <ResumeWorkoutAS />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  nullMessage: {
    textAlign: "center",
    width: "80%",
    fontSize: 14,
    marginTop: 10,
    color: "grey",
  },
});
