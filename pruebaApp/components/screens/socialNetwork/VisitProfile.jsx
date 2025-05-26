import React, { useState } from "react";
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
import { useFetchWithAuth } from "../../../utils/fetchWithAuth";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { BASE_URL } from "../../../context/config";
import { getUserAvatar } from "../../../utils/avatar";
import { FontAwesome6 } from "react-native-vector-icons";
import { SessionCard } from "../../Cards/SessionCard";
import { UnfollowAlert } from "../../../utils/Alerts/UnfollowAlert";

const LIMIT = 5;

export default function VisitProfile() {
  const navigation = useNavigation();
  const route = useRoute();
  const { username, follow_status } = route.params;
  const [follow_state, setfollow_state] = useState(follow_status);
  const fetchWithAuth = useFetchWithAuth();
  const [profileData, setProfileData] = React.useState(null);
  const [sessionsData, setSessionsData] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [initialLoadDone, setInitialLoadDone] = React.useState(false); //Bloquear onEndReached hasta que se carguen los datos iniciales
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchProfileData = async () => {
    try {
      setRefreshing(true);
      const response = await fetchWithAuth(
        `${BASE_URL}api/otherProfile/?username=${encodeURIComponent(username)}`,
        {
          method: "GET",
        }
      );

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
      console.log(BASE_URL);
      const response = await fetchWithAuth(
        `${BASE_URL}api/otherUserSessions/?username=${encodeURIComponent(username)}&limit=${LIMIT}&offset=${initial ? 0 : offset}`,
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

  const onRefresh = async () => {
    setRefreshing(true);
    if (follow_state === "following")
      await Promise.all([fetchProfileData(), fetchSessionsData(true)]);
    else await fetchProfileData(); // Solo se carga el perfil si no sigue al usuario visitado
    setRefreshing(false);
  };

  React.useEffect(() => {
    onRefresh();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLargeTitle: true,
      headerTitle: username,
    });
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

  const handleFollow = async (username) => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/sendFollowRequest/`,
        {
          method: "POST",
          body: JSON.stringify({ username }),
        }
      );

      if (response.ok) {
        // Actualizar follow_status localmente a "requested"
        setfollow_state("requested");
      } else {
        console.error("Server error");
      }
    } catch (error) {
      console.error("Error following user", error);
    }
  };
  const handleUnFollow = async (username) => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/cancelFollow/?username=${encodeURIComponent(username)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Actualizar follow_status localmente a "not_following"
        setfollow_state("not_following");
      } else {
        console.error("Server error");
      }
    } catch (error) {
      console.error("Error unfollowing user", error);
    }
  };
  const handlePending = async (username) => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/cancelFollowRequest/?username=${encodeURIComponent(username)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Actualizar follow_status localmente a "not_following"
        setfollow_state("not_following");
      } else {
        console.error("Server error");
      }
    } catch (error) {
      console.error("Error canceling follow request", error);
    }
  };

  const renderSessionItem = ({ item }) => <SessionCard item={item} />;

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <UnfollowAlert
          visible={selectedUser !== null}
          onCancel={() => setSelectedUser(null)}
          onDiscard={() => {
            handleUnFollow(selectedUser.username);
            setSelectedUser(null);
          }}
          username={selectedUser?.username}
        />
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
            onPress={() => {
              if (follow_state === "following") {
                navigation.navigate("VisitFollowers", { username: username });
              }
            }}
          >
            <Text style={styles.statNumber}>
              {profileData.estadisticas.total_seguidores}
            </Text>
            <Text style={styles.statLabel}>Followers</Text>
          </Pressable>
          <Pressable
            style={styles.statBox}
            onPress={() => {
              if (follow_state === "following") {
                navigation.navigate("VisitFollowed", {
                  username: username,
                });
              }
            }}
          >
            <Text style={styles.statNumber}>
              {profileData.estadisticas.total_seguidos}
            </Text>
            <Text style={styles.statLabel}>Following</Text>
          </Pressable>
        </View>
        {follow_state === "following" ? (
          <Pressable
            onPress={() => setSelectedUser(profileData.usuario)}
            style={styles.followButton}
          >
            <Text style={styles.followButtonText}>UnFollow</Text>
          </Pressable>
        ) : follow_state === "requested" ? (
          <Pressable
            onPress={() => handlePending(username)}
            style={styles.pendingButton}
          >
            <Text style={styles.pendingButtonText}>Requested</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => handleFollow(username)}
            style={styles.followButton}
          >
            <Text style={styles.followButtonText}>Follow</Text>
          </Pressable>
        )}
        {follow_state === "following" && (
          <Text style={styles.sesionesTitulo}>Workouts</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {follow_status === "following" ? (
        <FlatList
          data={sessionsData}
          renderItem={renderSessionItem}
          ListHeaderComponent={renderHeader}
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
                {username} hasn't worked out yet
              </Text>
            </View>
          }
        />
      ) : (
        renderHeader()
      )}
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
  followButton: {
    flexDirection: "row",
    alignSelf: "center",
    width: "98%",
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  followButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  pendingButton: {
    flexDirection: "row",
    alignSelf: "center",
    width: "98%",
    padding: 10,
    backgroundColor: "grey",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  pendingButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  nullMessage: {
    textAlign: "center",
    width: "80%",
    fontSize: 14,
    marginTop: 10,
    color: "grey",
  },
});
