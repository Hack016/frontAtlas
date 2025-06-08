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
import { useNavigation, useRoute } from "@react-navigation/native";
import { BASE_URL } from "../../context/config";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { getUserAvatar } from "../../utils/avatar";
import { Entypo, FontAwesome6 } from "react-native-vector-icons";
import { ResumeWorkoutAS } from "../../utils/ResumeWorkoutAS";
import { WorkoutTimeContext } from "../../context/WorkoutTimeContext";
import { SessionCard } from "../Cards/SessionCard";
const LIMIT = 5;

export default function ProfileFeedScreen() {
  const { isWorkoutActive } = useContext(WorkoutTimeContext);
  const navigation = useNavigation();
  const fetchWithAuth = useFetchWithAuth();
  const route = useRoute();
  const showHeaderButtons = route.params?.showHeaderButtons !== false;
  const [profileData, setProfileData] = React.useState(null);
  const [sessionsData, setSessionsData] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [initialLoadDone, setInitialLoadDone] = React.useState(false); //Bloquear onEndReached hasta que se carguen los datos iniciales

  const fetchProfileData = async () => {
    try {
      setRefreshing(true);
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
        `${BASE_URL}api/userSessions/?limit=${LIMIT}&offset=${initial ? 0 : offset}`,
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
    await Promise.all([fetchProfileData(), fetchSessionsData(true)]);
    setRefreshing(false);
  };

  React.useEffect(() => {
    onRefresh();
  }, []);

  React.useLayoutEffect(() => {
    if (!profileData) {
      // si no hay datos de perfil aún, no cargar el botón de ajustes porque falla al intentar acceder a la info de profileData
      return;
    }
    if (showHeaderButtons === false) {
      navigation.setOptions({
        headerLargeTitle: true,
        headerTitle: profileData.usuario.username,
      });
      return;
    }
    navigation.setOptions({
      headerLargeTitle: true,
      headerTitle: profileData.usuario.username,
      headerRight: () => (
        <View style={styles.headerButtons}>
          <Pressable
            onPress={() => navigation.navigate("Follow Requests")}
            style={styles.followButton}
          >
            <MaterialCommunityIcons name="account-plus-outline" size={24} />
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate("Settings", {
                email: profileData.usuario.email,
                username: profileData.usuario.username,
              })
            }
            style={styles.settingsButton}
          >
            <Ionicons name="settings-outline" size={24} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, profileData]);

  if (!profileData) {
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
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Image
              source={getUserAvatar(profileData.usuario)}
              style={styles.profileImage}
            />

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
              <Pressable
                style={styles.statBox}
                onPress={() => navigation.navigate("Followers")}
              >
                <Text style={styles.statNumber}>
                  {profileData.estadisticas.total_seguidores}
                </Text>
                <Text style={styles.statLabel}>Followers</Text>
              </Pressable>
              <Pressable
                style={styles.statBox}
                onPress={() => navigation.navigate("Followed")}
              >
                <Text style={styles.statNumber}>
                  {profileData.estadisticas.total_seguidos}
                </Text>
                <Text style={styles.statLabel}>Following</Text>
              </Pressable>
            </View>
            <Text style={styles.sesionesTitulo}>Dashboard</Text>
            <View style={styles.dashboardRow}>
              <Pressable
                // style={styles.dashboardButton}
                style={({ pressed }) => [
                  pressed
                    ? { ...styles.dashboardButton, opacity: 0.5 }
                    : styles.dashboardButton,
                ]}
                onPress={() => navigation.navigate("Statistics")}
              >
                <FontAwesome6
                  style={styles.dashboardButtonIcon}
                  name="chart-line"
                  size={24}
                />
                <Text style={styles.dashboardButtonTitle}>Statistics</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  pressed
                    ? { ...styles.dashboardButton, opacity: 0.5 }
                    : styles.dashboardButton,
                ]}
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
            {/* Botones para futuras implementaciones */}
            {/* <View style={styles.dashboardRow}>
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
            </View> */}
            <Text style={styles.sesionesTitulo}>Workouts</Text>
          </View>
        }
        data={sessionsData}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.idSesion.toString()}
        onEndReached={() => fetchSessionsData(false)}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
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
              The world won't carry itself. Tap below in Train to begin your
              first session.
            </Text>
          </View>
        }
      />
      {isWorkoutActive && <ResumeWorkoutAS />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: "row",
    marginBottom: 40,
  },
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
    top: 20,
    right: 20,
  },
  followButton: {
    top: 22,
    right: 60,
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
  nullMessage: {
    width: "80%",
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
    color: "grey",
  },
});
