import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  RefreshControl,
} from "react-native";

export default function HomeFeedScreen() {
  const [sessions, setSessions] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchSessions = async () => {
    setRefreshing(true);
    // Aquí iría tu fetchWithAuth a la API
    // const data = await fetchWithAuth('/api/feed');
    const data = [
      { id: "1", user: "Juan", activity: "Entrenó pecho y triceps" },
      { id: "2", user: "Tú", activity: "Hiciste pierna 💪" },
    ];
    setSessions(data);
    setRefreshing(false);
  };

  React.useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchSessions} /> // RefresControl es para deslizar hacia abajo y recargar
        }
      >
        {sessions.map((item) => (
          <View key={item.id} style={styles.sessionCard}>
            <Text style={styles.sessionUser}>{item.user}</Text>
            <Text>{item.activity}</Text>
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
});
