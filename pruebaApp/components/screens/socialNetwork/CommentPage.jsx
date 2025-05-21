import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  RefreshControl,
  TextInput,
  Pressable,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFetchWithAuth } from "../../../utils/fetchWithAuth";
import { BASE_URL } from "../../../context/config";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getUserAvatar } from "../../../utils/avatar";
import { UnfollowAlert } from "../../../utils/UnfollowAlert";
import { AuthContext } from "../../../context/AuthContext";
const LIMIT = 20;

export default function CommentSection() {
  const navigation = useNavigation();
  const { authTokens } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const route = useRoute();
  const { idSesion, usuario, fecha, nombre } = route.params;
  const fetchWithAuth = useFetchWithAuth();
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    searchComments(true);
  }, []);

  const eliminarDuplicados = (comentarios) => {
    const mapa = new Map();
    comentarios.forEach((coment) => {
      mapa.set(coment.idComentario, coment);
    });
    return Array.from(mapa.values());
  };
  const searchComments = async (initial = false) => {
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
        `${BASE_URL}api/getPostComments/?idSesion=${encodeURIComponent(idSesion)}&limit=${LIMIT}&offset=${initial ? 0 : offset}`,
        { method: "GET" }
      );

      const data = await response.json();

      if (response.ok) {
        if (initial) {
          setResults(eliminarDuplicados(data.results));
        } else {
          // evitar mostrar comentarios duplicados
          const newItems = data.results.filter(
            (item) => !results.some((u) => u.idComentario === item.idComentario)
          );
          setResults((prev) => eliminarDuplicados([...prev, ...newItems]));
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

  const handlePostComment = async () => {
    try {
      const response = await fetchWithAuth(`${BASE_URL}api/postComment/`, {
        method: "POST",
        body: JSON.stringify({ idSesion, contenido: newComment }),
      });

      if (response.ok) {
        const nuevoComentario = await response.json();
        setResults((prev) => {
          // Evita agregar duplicados si ya está
          const yaExiste = prev.some(
            (coment) => coment.idComentario === nuevoComentario.idComentario
          );

          if (yaExiste) return prev;

          return [nuevoComentario, ...prev];
        });
      } else {
        console.error("Server error");
      }
    } catch (error) {
      console.error("Error following user", error);
    }
  };

  const handleDeleteComment = async (idComentario) => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/deleteComment/?idComentario=${encodeURIComponent(idComentario)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setResults((prev) =>
          prev.filter((coment) => coment.idComentario !== idComentario)
        );
      } else {
        console.error("Server error");
      }
    } catch (error) {
      console.error("Error following user", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Pressable
        style={styles.userRow}
        onPress={() => {
          if (item.usuario.username === authTokens.username)
            navigation.navigate("Profile", {
              showHeaderButtons: false,
            });
          else
            navigation.navigate("VisitProfile", {
              username: item.usuario.username,
              follow_status: item.usuario.follow_status,
            });
        }}
      >
        <Image source={getUserAvatar(item.usuario)} style={styles.image} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.usuario.username}</Text>
          <Text style={styles.name}>
            {new Date(item.fecha).toLocaleString()}
          </Text>
        </View>
        {item.usuario.username === authTokens.username ||
        usuario.username === authTokens.username ? (
          <Pressable onPress={() => handleDeleteComment(item.idComentario)}>
            <Text style={styles.deleteButton}>Delete</Text>
          </Pressable>
        ) : null}
      </Pressable>
      <View style={styles.commentContainer}>
        <Text style={styles.commentText}>{item.contenido}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {results.length === 0 && !refreshing && !loadingMore ? (
        <>
          <Pressable
            style={styles.userHeader}
            onPress={() => {
              if (usuario.username === authTokens.username)
                navigation.navigate("Profile", { showHeaderButtons: false });
              else
                navigation.navigate("VisitProfile", {
                  username: usuario.username,
                  follow_status: usuario.follow_status,
                });
            }}
          >
            <Image source={getUserAvatar(usuario)} style={styles.image} />
            <View>
              <Text style={styles.userSession}>{usuario.username}</Text>
              <Text style={styles.sessionDate}>
                {new Date(fecha).toLocaleDateString()}
              </Text>
            </View>
          </Pressable>
          <View style={styles.sessionTitleView}>
            <Text style={styles.sessionTitle}>{nombre}</Text>
          </View>
          <View style={styles.container}>
            <Image source={getUserAvatar(usuario)} style={styles.image} />

            <Text style={{ fontSize: 16, color: "gray", marginTop: 10 }}>
              Be the first to comment in this post!
            </Text>
          </View>
        </>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          ListHeaderComponent={
            <>
              <Pressable
                style={styles.userHeader}
                onPress={() => {
                  if (usuario.username === authTokens.username)
                    navigation.navigate("Profile", {
                      showHeaderButtons: false,
                    });
                  else
                    navigation.navigate("VisitProfile", {
                      username: usuario.username,
                      follow_status: usuario.follow_status,
                    });
                }}
              >
                <Image source={getUserAvatar(usuario)} style={styles.image} />
                <View>
                  <Text style={styles.userSession}>{usuario.username}</Text>
                  <Text style={styles.sessionDate}>
                    {new Date(fecha).toLocaleDateString()}
                  </Text>
                </View>
              </Pressable>
              <View style={styles.sessionTitleView}>
                <Text style={styles.sessionTitle}>{nombre}</Text>
              </View>
            </>
          }
          keyExtractor={(item) => String(item.idComentario)}
          onEndReached={() => searchComments(false)}
          onEndReachedThreshold={0.5} // Carga más cuando estás al 50% del final
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => searchComments(true)}
            />
          }
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Write a comment..."
          style={styles.input}
          multiline
          placeholderTextColor={"gray"}
        />
        <Pressable
          disabled={newComment === ""}
          onPress={() => handlePostComment()}
        >
          <Ionicons
            style={[
              styles.postButton,
              newComment === "" && styles.postButtonDisabled,
            ]}
            name="arrow-up"
            size={24}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 20,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 10,
  },
  userSession: {
    fontWeight: "bold",
    fontSize: 16,
  },
  sessionDate: {
    fontSize: 14,
    color: "gray",
  },
  sessionTitle: {
    marginLeft: 20,
    fontSize: 16,
    fontWeight: "bold",
    TextAlign: "center",
    marginBottom: 5,
  },
  sessionTitleView: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: 100,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  userInfo: {
    flexDirection: "column",
    flex: 1,
  },
  itemContainer: {
    flexDirection: "column",
    flex: 1,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
  },
  commentContainer: {
    flex: 1,
  },
  commentText: {
    fontSize: 14,
    TextAlign: "left",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 14,
    marginRight: 10,
    color: "black",
    padding: 10,
    outlineStyle: "none",
  },
  postButton: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  postButtonDisabled: {
    color: "gray",
    fontWeight: "bold",
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
    fontSize: 14,
  },
  deleteWrapper: {
    marginLeft: "auto",
  },
});
