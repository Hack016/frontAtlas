import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  Dimensions,
} from "react-native";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { useRoute } from "@react-navigation/native";
import { BASE_URL } from "../../context/config";
import { getExerciseImageUrl } from "../../utils/avatar";

const { width: screenWidth } = Dimensions.get("window");

export default function HowTo() {
  const fetchWithAuth = useFetchWithAuth();

  const [ejercicio, setEjercicio] = React.useState([]);
  const { params } = useRoute();
  const idEjercicio = params?.idEjercicio;
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const fetchEjercicio = async () => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/ejercicio/${idEjercicio}/howto/`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      setEjercicio(data);

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
    fetchEjercicio();
  }, []);

  const renderDots = () => {
    if (!ejercicio?.imagenes || !Array.isArray(ejercicio.imagenes)) return null;
    return (
      <View style={styles.dotsContainer}>
        {ejercicio.imagenes.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === currentIndex && styles.activeDot]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {ejercicio.imagenes?.length > 1 ? (
          <View style={{ width: screenWidth }}>
            <FlatList
              data={ejercicio.imagenes}
              renderItem={({ item }) => (
                <Image
                  source={getExerciseImageUrl(item)}
                  style={styles.image}
                  key={item}
                />
              )}
              horizontal
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              onScroll={(event) => {
                const offset = event.nativeEvent.contentOffset.x;
                const index = Math.round(offset / screenWidth); //Para saber cuanto se ha desplazado y así calcular en que imagen está para el renderDots
                setCurrentIndex(index);
              }}
            />

            {renderDots()}
          </View>
        ) : ejercicio.imagenes?.length === 1 ? (
          <Image
            source={getExerciseImageUrl(ejercicio.imagenes[0])}
            style={styles.image}
          />
        ) : (
          <Image
            source={require("../../assets/TitanVectorizado.png")}
            style={styles.image}
          />
        )}
        <Text style={styles.title}>{ejercicio.nombre}</Text>
        <Text style={styles.instructions}>{ejercicio.indicaciones}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  swiper: {
    height: 250,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  image: {
    width: screenWidth,
    height: 250,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  instructions: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingTop: 10,
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#007bff",
  },
});
