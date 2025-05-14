import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  RefreshControl,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../context/config";
import Icon from "react-native-vector-icons/Ionicons";
import { getUserAvatar } from "../../utils/avatar";
import { Entypo, FontAwesome6 } from "react-native-vector-icons";
import { ResumeWorkoutAS } from "../ResumeWorkoutAS";
import { WorkoutTimeContext } from "../../context/WorkoutTimeContext";
import { SessionCard } from "../SessionCard";

export default function ProfileFeedScreen() {
  const { isWorkoutActive } = useContext(WorkoutTimeContext);
  const navigation = useNavigation();

  const fetchWithAuth = useFetchWithAuth();

  const [profileData, setProfileData] = React.useState(null);
  const [sessionsData, setSessionsData] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchProfileData = async () => {
    try {
      setRefreshing(true);
      console.log(BASE_URL);
      const response = await fetchWithAuth(`${BASE_URL}api/profile/`, {
        method: "GET",
      });

      setRefreshing(false);

      const data = await response.json();
      setProfileData(data);

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error || "Server not available" };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  const fetchSessionsData = async () => {
    try {
      setRefreshing(true);
      console.log(BASE_URL);
      const response = await fetchWithAuth(`${BASE_URL}api/userSessions/`, {
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
    await Promise.all([fetchProfileData(), fetchSessionsData()]);
    setRefreshing(false);
  };

  React.useEffect(() => {
    onRefresh();
  }, []);

  if (!profileData) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator color="black" size="large" />
      </SafeAreaView>
    );
  }

  const renderSessionItem = ({ item }) => <SessionCard item={item} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Image
              source={getUserAvatar(profileData.usuario)}
              style={styles.profileImage}
            />
            <Pressable
              onPress={() =>
                navigation.navigate("Settings", {
                  email: profileData.usuario.email,
                  username: profileData.usuario.username,
                })
              }
              style={styles.settingsButton}
            >
              <Icon name="settings-outline" size={24} />
            </Pressable>

            <Text style={styles.name}>
              {profileData.usuario?.nombre
                ? profileData.usuario.nombre
                : "No tiene nombre"}
            </Text>
            <Text style={styles.username}>
              @
              {profileData.usuario?.username
                ? profileData.usuario.username
                : "No tiene username"}
            </Text>

            {profileData.usuario?.biografia ? (
              <Text style={styles.bio}>{profileData.usuario.biografia}</Text>
            ) : null}

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {profileData.estadisticas.total_sesiones}
                </Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {profileData.estadisticas.total_seguidores}
                </Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {profileData.estadisticas.total_seguidos}
                </Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
            <Text style={styles.sesionesTitulo}>Dashboard</Text>
            <View style={styles.dashboardRow}>
              <Pressable
                style={styles.dashboardButton}
                onPress={() => console.log("Statistics")}
              >
                <FontAwesome6
                  style={styles.dashboardButtonIcon}
                  name="chart-line"
                  size={24}
                />
                <Text style={styles.dashboardButtonTitle}>Statistics</Text>
              </Pressable>
              <Pressable
                style={styles.dashboardButton}
                onPress={() => navigation.navigate("Exercises")}
              >
                <FontAwesome6
                  style={styles.dashboardButtonIcon}
                  name="dumbbell"
                  size={24}
                />
                <Text style={styles.dashboardButtonTitle}>Exercises</Text>
              </Pressable>
            </View>
            <View style={styles.dashboardRow}>
              <Pressable
                style={styles.dashboardButton}
                onPress={() => console.log("Graphs")}
              >
                <Entypo
                  style={styles.dashboardButtonIcon}
                  name="bar-graph"
                  size={24}
                />
                <Text style={styles.dashboardButtonTitle}>Graphs</Text>
              </Pressable>
              <Pressable
                style={styles.dashboardButton}
                onPress={() => console.log("Calendar")}
              >
                <Entypo
                  style={styles.dashboardButtonIcon}
                  name="calendar"
                  size={24}
                />
                <Text style={styles.dashboardButtonTitle}>Calendar</Text>
              </Pressable>
            </View>
            <Text style={styles.sesionesTitulo}>Workouts</Text>
          </View>
        }
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

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 15,
  },
  settingsButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
    borderBottomWidth: 1,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "gray",
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
  },
  sesionesTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "grey",
  },
  dashboardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dashboardButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "grey",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 15,
    marginBottom: 10,
    marginTop: 5,
  },
  dashboardButtonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    alignContent: "center",
  },
  dashboardButtonIcon: {
    marginRight: 10,
    color: "white",
  },
});
