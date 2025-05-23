import React from "react";
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
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../../context/config";
import { useFetchWithAuth } from "../../../utils/fetchWithAuth";
import { useState } from "react";
import { getUserAvatar } from "../../../utils/avatar";
import { Ionicons } from "@expo/vector-icons";
const LIMIT = 20;

export default function FollowRequests() {
  const navigation = useNavigation();
  const [results, setResults] = useState([]);
  const fetchWithAuth = useFetchWithAuth();
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
        `${BASE_URL}api/getFollowRequests/?limit=${LIMIT}&offset=${initial ? 0 : offset}`,
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

  const handleDecline = async (username) => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/declineFollowRequest/?username=${encodeURIComponent(username)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Actualizar results localmente para eliminar de la lista al usuario
        setResults((prev) => prev.filter((user) => user.username !== username));
      } else {
        console.error("Server error");
      }
    } catch (error) {
      console.error("Error canceling follow request", error);
    }
  };

  const handleAccept = async (username) => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/acceptFollowRequest/`,
        {
          method: "POST",
          body: JSON.stringify({ username }),
        }
      );

      if (response.ok) {
        // Actualizar results localmente para eliminar de la lista al usuario
        setResults((prev) => prev.filter((user) => user.username !== username));
      } else {
        console.error("Server error");
      }
    } catch (error) {
      console.error("Error canceling follow request", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.userRow}>
      <Image source={getUserAvatar(item)} style={styles.imageUser} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.name}>{item.nombre}</Text>
      </View>
      <View style={styles.buttonRow}>
        <Pressable
          onPress={() => handleAccept(item.username)}
          style={styles.acceptButton}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </Pressable>
        <Pressable
          onPress={() => handleDecline(item.username)}
          style={styles.declineButton}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {results.length === 0 && !refreshing && !loadingMore ? (
        <View style={styles.container}>
          <Ionicons name="people-circle-outline" size={150} color="black" />

          <Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }}>
            Follow requests
          </Text>

          <Text style={{ fontSize: 16, color: "gray" }}>
            When people ask to follow you, you'll see their requests here
          </Text>
        </View>
      ) : (
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
  acceptButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: "auto",
  },
  declineButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: "auto",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
