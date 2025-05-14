import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, StyleSheet, RefreshControl } from "react-native";
import { ResumeWorkoutAS } from "../ResumeWorkoutAS";
import { WorkoutTimeContext } from "../../context/WorkoutTimeContext";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { BASE_URL } from "../../context/config";
import { SessionCard } from "../SessionCard";

export default function HomeFeedScreen() {
  const fetchWithAuth = useFetchWithAuth();
  const { isWorkoutActive } = useContext(WorkoutTimeContext);
  const [sessionsData, setSessionsData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchSessionsData = async () => {
    try {
      setRefreshing(true);
      console.log(BASE_URL);
      const response = await fetchWithAuth(`${BASE_URL}api/mainfeed/`, {
        method: "GET",
      });

      setRefreshing(false);

      const data = await response.json();
      setSessionsData(data.results);

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error || "Server not available" };
      }
    } catch (error) {
      return { success: false, error };
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all(fetchSessionsData());
    setRefreshing(false);
  };

  React.useEffect(() => {
    onRefresh();
  }, []);

  const renderSessionItem = ({ item }) => <SessionCard item={item} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={sessionsData}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.idSesion.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      {isWorkoutActive && <ResumeWorkoutAS />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
