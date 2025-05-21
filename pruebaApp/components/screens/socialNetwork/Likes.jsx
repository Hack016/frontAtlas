import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BASE_URL } from "../../../context/config";
import { useFetchWithAuth } from "../../../utils/fetchWithAuth";
import { useState } from "react";
import { getUserAvatar } from "../../../utils/avatar";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../../context/AuthContext";
import { UnfollowAlert } from "../../../utils/UnfollowAlert";
const LIMIT = 20;

export default function Likes() {
  const navigation = useNavigation();
  const { authTokens } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const fetchWithAuth = useFetchWithAuth();
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const route = useRoute();
  const { idSesion } = route.params;
  const [selectedUser, setSelectedUser] = useState(null);

  React.useEffect(() => {
    searchUsers(true);
  }, []);

  const searchUsers = async (initial = false) => {
    if (loadingMore || (!initial && !hasMore)) return;

    if (initial) {
      setRefreshing(true);
      setOffset(0);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/getPostLikes/?idSesion=${encodeURIComponent(idSesion)}&limit=${LIMIT}&offset=${initial ? 0 : offset}`,
        { method: "GET" }
      );

      const data = await response.json();

      if (response.ok) {
        if (initial) {
          setResults(data.results);
        } else {
          // evitar mostrar usuarios duplicados
          const newItems = data.results.filter(
            (item) => !results.some((u) => u.username === item.username)
          );
          setResults((prev) => [...prev, ...newItems]);
        }

        setOffset((prev) => prev + LIMIT);
        if (data.results.length < LIMIT) setHasMore(false);
      } else {
        console.error("Error en el servidor");
      }
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

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
        setResults((prev) =>
          prev.map((user) =>
            user.username === username
              ? { ...user, follow_status: "requested" }
              : user
          )
        );
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
        setResults((prev) =>
          prev.map((user) =>
            user.username === username
              ? { ...user, follow_status: "not_following" }
              : user
          )
        );
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
        setResults((prev) =>
          prev.map((user) =>
            user.username === username
              ? { ...user, follow_status: "not_following" }
              : user
          )
        );
      } else {
        console.error("Server error");
      }
    } catch (error) {
      console.error("Error canceling follow request", error);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.userRow}
      onPress={() => {
        if (item.username === authTokens.username)
          navigation.navigate("Profile");
        else
          navigation.navigate("VisitProfile", {
            username: item.username,
            follow_status: item.follow_status,
          });
      }}
    >
      <Image source={getUserAvatar(item)} style={styles.imageUser} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.name}>{item.nombre}</Text>
      </View>
      {item.username === authTokens.username ? null : item.follow_status ===
        "following" ? (
        <Pressable
          onPress={() => setSelectedUser(item)}
          style={styles.followButton}
        >
          <Text style={styles.followButtonText}>UnFollow</Text>
        </Pressable>
      ) : item.follow_status === "requested" ? (
        <Pressable
          onPress={() => handlePending(item.username)}
          style={styles.pendingButton}
        >
          <Text style={styles.pendingButtonText}>Requested</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => handleFollow(item.username)}
          style={styles.followButton}
        >
          <Text style={styles.followButtonText}>Follow</Text>
        </Pressable>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {results.length === 0 && !refreshing && !loadingMore ? (
        <View style={styles.container}>
          <Ionicons name="people-circle-outline" size={150} color="black" />

          <Text style={{ fontSize: 16, color: "gray" }}>
            Be the first one to leave a like!
          </Text>
        </View>
      ) : (
        <>
          <UnfollowAlert
            visible={selectedUser !== null}
            onCancel={() => setSelectedUser(null)}
            onDiscard={() => {
              handleUnFollow(selectedUser.username);
              setSelectedUser(null);
            }}
            username={selectedUser?.username}
          />
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={(item) => item.username}
            onEndReached={() => searchUsers(false)}
            onEndReachedThreshold={0.5} // Carga más cuando estás al 50% del final
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => searchUsers(true)}
              />
            }
          />
        </>
      )}

      {loadingMore && <ActivityIndicator size="small" style={styles.icon} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: 100,
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
  imageUser: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 0.9,
    borderBottomColor: "#ccc",
  },
  buttonRow: {
    flexDirection: "row",
    padding: 12,
    position: "absolute",
    right: 0,
  },
  userInfo: {
    flexDirection: "column",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  name: {
    fontSize: 14,
    color: "grey",
  },
  followButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: "auto",
  },
  followButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  pendingButton: {
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: "auto",
  },
  pendingButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "transparent",
    padding: 10,
  },
});
