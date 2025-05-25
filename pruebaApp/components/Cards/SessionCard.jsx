// components/SessionCard.js
import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { getExerciseImageUrl, getUserAvatar } from "../../utils/avatar";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import { sharePost } from "../../utils/branch";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { BASE_URL } from "../../context/config";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";

export const SessionCard = ({ item }) => {
  const { authTokens } = React.useContext(AuthContext);
  const fetchWithAuth = useFetchWithAuth();
  const navigation = useNavigation();
  const [liked, setLiked] = React.useState(item.liked);
  const [likesCount, setLikesCount] = React.useState(item.likes);

  const handleLike = async () => {
    try {
      const response = await fetchWithAuth(`${BASE_URL}api/likePost/`, {
        method: "POST",
        body: JSON.stringify({ idSesion: item.idSesion }),
      });

      if (response.ok) {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      } else {
        console.error("Server error");
      }
    } catch (error) {
      console.error("Error sending like", error);
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/unlikePost/?idSesion=${encodeURIComponent(item.idSesion)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        console.error("Server error");
      }
    } catch (error) {
      console.error("Error sending like", error);
    }
  };
  return (
    <Pressable
      style={styles.sessionCard}
      onPress={() =>
        navigation.navigate("Workout Detail", { idSesion: item.idSesion })
      }
    >
      {/* Nombre de usuario con fecha de la sesión y foto de perfil  */}
      <Pressable
        style={styles.userHeader}
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
        <View>
          <Text style={styles.userSession}>{item.usuario.username}</Text>
          <Text style={styles.sessionDate}>
            {new Date(item.fecha).toLocaleString()}
          </Text>
        </View>
      </Pressable>
      {/* Información de la sesión */}
      <Text style={styles.sessionTitle}>{item.nombre}</Text>

      {item.tiempo > 60 ? (
        <View style={styles.sessionRow}>
          <Text style={[styles.sessionInfo, { marginRight: 20 }]}>
            Time: {Math.floor(item.tiempo / 60)}h {item.tiempo % 60}min
          </Text>
          <Text style={styles.sessionInfo}>Volume: {item.volumen} kg</Text>
        </View>
      ) : (
        <View style={styles.sessionRow}>
          <Text style={[styles.sessionInfo, { marginRight: 20 }]}>
            Time: {item.tiempo} min
          </Text>
          <Text style={styles.sessionInfo}>Volume: {item.volumen} kg</Text>
        </View>
      )}

      {item.ejercicios.map((ej, index) => (
        <View key={index} style={styles.exercisePreview}>
          <View style={styles.exerciseRow}>
            <Image
              source={getExerciseImageUrl(ej.imagen)}
              style={styles.image}
            />
            <Text style={styles.exerciseName}>{ej.nombre}</Text>
          </View>
        </View>
      ))}
      {item.morethan3 === true && (
        <Text style={styles.loadMore}>Load more...</Text>
      )}

      <View style={styles.sessionSocial}>
        <Pressable
          onPress={() =>
            navigation.navigate("Likes", { idSesion: item.idSesion })
          }
        >
          <Text style={styles.socialText}>
            {likesCount} {likesCount === 1 ? "like" : "likes"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate("Comments", {
              idSesion: item.idSesion,
              usuario: item.usuario,
              fecha: item.fecha,
              nombre: item.nombre,
            })
          }
        >
          <Text style={styles.socialText}>
            {item.comentarios} {item.comentarios === 1 ? "comment" : "comments"}
          </Text>
        </Pressable>
      </View>
      <View style={styles.buttonRow}>
        <Pressable
          style={styles.button}
          onPress={() => {
            if (liked) handleUnlike();
            else handleLike();
          }}
        >
          {liked ? (
            <Ionicons name="heart" size={24} color="black" />
          ) : (
            <Ionicons name="heart-outline" size={24} color="black" />
          )}
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() =>
            navigation.navigate("Comments", {
              idSesion: item.idSesion,
              usuario: item.usuario,
              fecha: item.fecha,
              nombre: item.nombre,
            })
          }
        >
          <Fontisto name="comment" size={24} color="black" />
        </Pressable>
        <Pressable style={styles.button} onPress={() => sharePost("192")}>
          <Ionicons name="share-social-outline" size={24} color="black" />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  sessionCard: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 15,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#333",
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sessionRow: {
    flexDirection: "row",
    marginVertical: 10,
    paddingBottom: 10,
  },
  sessionInfo: {
    fontSize: 14,
    color: "gray",
  },
  exercisePreview: {},
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  exerciseName: {
    fontSize: 14,
    alignContent: "center",
  },
  loadMore: {
    paddingTop: 10,
    fontSize: 14,
    color: "gray",
  },
  sessionSocial: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialText: {
    fontSize: 14,
    color: "gray",
  },
  buttonRow: {
    borderTopWidth: 1,
    borderTopColor: "gray",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    marginTop: 10,
  },
});
