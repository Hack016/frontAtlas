import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  RefreshControl,
  Image,
  ActivityIndicator,
} from "react-native";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../context/config";
import Titan from "../../assets/TitanVectorizado.png";

export default function ProfileFeedScreen() {
  const navigation = useNavigation();

  const fetchWithAuth = useFetchWithAuth();

  const [profileData, setProfileData] = React.useState(null);
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

  React.useEffect(() => {
    fetchProfileData();
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
  // if (!profileData) return null;

  // const { usuario, estadisticas } = profileData;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchProfileData}
          />
        }
      >
        <Image
          source={
            profileData.usuario?.foto_perfil
              ? { uri: profileData.usuario.foto_perfil }
              : Titan
          }
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
            <Text style={styles.statLabel}>Sesiones</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {profileData.estadisticas.total_seguidores}
            </Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {profileData.estadisticas.total_seguidos}
            </Text>
            <Text style={styles.statLabel}>Seguidos</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
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
  },
});
