import React from "react";
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

const mockSessions = [
  //mock para simular la salida mientras no implemente crear sesiones
  {
    username: "admin",
    profilePic: "",
    sexo: "Male",
    idSesion: 1,
    nombre: "Rutina Full Body",
    tiempo: 75,
    fecha: "2025-04-19T14:30:00Z",
    ejercicios: [
      {
        nombre: "Sentadillas",
        imagen: "https://wger.de/media/exercise-images/192/Bench-press-1.png",
      },
      {
        nombre: "Press banca",
        imagen: "https://wger.de/media/exercise-images/192/Bench-press-1.png",
      },
      {
        nombre: "Remo con barra",
        imagen: "https://wger.de/media/exercise-images/192/Bench-press-1.png",
      },
    ],
    volumen: 4278,
    likes: 12,
    comentarios: 3,
  },
  {
    username: "admin",
    profilePic: "",
    sexo: "Male",
    idSesion: 2,
    nombre: "Pierna y Core",
    tiempo: 50,
    fecha: "2025-04-18T10:15:00Z",
    ejercicios: [
      {
        nombre: "Peso muerto rumano",
        imagen: "https://wger.de/media/exercise-images/192/Bench-press-1.png",
      },
      {
        nombre: "Plancha",
        imagen: "https://wger.de/media/exercise-images/192/Bench-press-1.png",
      },
    ],
    volumen: 5002,
    likes: 7,
    comentarios: 1,
  },
  {
    username: "admin",
    profilePic: "",
    sexo: "Male",
    idSesion: 3,
    nombre: "Push Day",
    tiempo: 40,
    fecha: "2025-04-16T18:00:00Z",
    ejercicios: [
      {
        nombre: "Fondos",
        imagen: "https://wger.de/media/exercise-images/192/Bench-press-1.png",
      },
      {
        nombre: "Press militar",
        imagen: "https://wger.de/media/exercise-images/192/Bench-press-1.png",
      },
      {
        nombre: "Aperturas con mancuernas",
        imagen: "https://wger.de/media/exercise-images/192/Bench-press-1.png",
      },
    ],
    volumen: 3349,
    likes: 25,
    comentarios: 5,
  },
];

export default function ProfileFeedScreen() {
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
      // setRefreshing(true);
      // console.log(BASE_URL);
      // const response = await fetchWithAuth(`${BASE_URL}api/userSessions/`, {
      //   method: "GET",
      // });

      // setRefreshing(false);

      // const data = await response.json();
      setSessionsData(mockSessions);

      // if (response.ok) {
      //   return { success: true, data };
      // } else {
      //   return { success: false, error: data.error || "Server not available" };
      // }
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
        <ActivityIndicator color="white" size="small" />
      </SafeAreaView>
    );
  }

  const renderSessionItem = ({ item }) => (
    <View style={styles.sessionCard}>
      {/* Nombre de usuario con fecha de la sesión y foto de perfil  */}
      <View style={styles.userHeader}>
        <Image source={getUserAvatar(item)} style={styles.image} />
        <View>
          <Text style={styles.userSession}>{item.username}</Text>
          <Text style={styles.sessionDate}>
            {new Date(item.fecha).toLocaleDateString()}
          </Text>
        </View>
      </View>
      {/* Información de la sesión */}
      <Text style={styles.sessionTitle}>{item.nombre}</Text>

      {item.tiempo > 60 ? (
        <View style={styles.sessionRow}>
          <Text style={[styles.sessionInfo, { marginRight: 20 }]}>
            Time: {Math.floor(item.tiempo / 60)} h {item.tiempo % 60} min
          </Text>
          <Text style={styles.sessionInfo}>
            Volume:
            {item.volumen} kg
          </Text>
        </View>
      ) : (
        <View style={styles.sessionRow}>
          <Text style={[styles.sessionInfo, { marginRight: 20 }]}>
            Time: {item.tiempo} min
          </Text>
          <Text style={styles.sessionInfo}>
            Volume:
            {item.volumen} kg
          </Text>
        </View>
      )}

      {item.ejercicios.map((ej, index) => (
        <View key={index} style={styles.exercisePreview}>
          <View style={styles.exerciseRow}>
            <Image source={{ uri: ej.imagen }} style={styles.image} />
            <Text style={styles.exerciseName}>{ej.nombre}</Text>
          </View>
        </View>
      ))}
      <Text style={styles.loadMore}>Load more...</Text>

      <View style={styles.sessionSocial}>
        <Text style={styles.socialText}>
          {item.likes} {item.likes === 1 ? "like" : "likes"} {item.comentarios}{" "}
          {item.comentarios === 1 ? "comment" : "comments"}
        </Text>
      </View>
    </View>
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
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userSession: {
    fontWeight: "bold",
    fontSize: 16,
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
  sessionCard: {
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sessionInfo: {
    fontSize: 14,
    color: "gray",
  },
  sessionRow: {
    flexDirection: "row",
    marginVertical: 10,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  exerciseName: {
    fontSize: 14,
    alignContent: "center",
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
  sessionSocial: {
    marginTop: 10,
  },
  socialText: {
    fontSize: 14,
    color: "gray",
  },
  loadMore: {
    paddingTop: 10,
    fontSize: 14,
    color: "gray",
  },
  sesionesTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
});
