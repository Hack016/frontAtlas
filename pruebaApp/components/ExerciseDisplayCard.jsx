import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getExerciseImageUrl } from "../utils/avatar";

export const ExerciseDisplayCard = ({ ejercicio }) => {
  const navigation = useNavigation();
  const series = ejercicio.series || [];

  return (
    <View style={styles.card}>
      <Pressable
        style={({ pressed }) => [
          styles.headerButton,
          pressed && { opacity: 0.6 },
        ]}
        onPress={() =>
          navigation.navigate("ExerciseDetail", {
            idEjercicio: ejercicio.idEjercicio,
            nombreEjercicio: ejercicio.nombre, // Le paso el nombre para que el titulo de la página sea el nombre del ejercicio
          })
        }
      >
        <View style={styles.headerRow}>
          <Image
            source={getExerciseImageUrl(ejercicio.imagen)}
            style={styles.image}
          />
          <Text style={styles.title}>{ejercicio.nombre}</Text>
        </View>
      </Pressable>

      <View style={styles.headerSets}>
        <Text style={styles.label}>SET</Text>
        <Text style={styles.label}>KG</Text>
        <Text style={styles.label}>REPS</Text>
      </View>

      {series.map((s, idx) => (
        <View key={s.idSerie} style={styles.row}>
          <Text
            style={[
              styles.cell,
              {
                color:
                  s.tipo === "Drop Set"
                    ? "blue"
                    : s.tipo === "Failure Set"
                      ? "red"
                      : s.tipo === "Warm Up Set"
                        ? "#FFD700"
                        : "black",
                fontWeight: "bold",
              },
            ]}
          >
            {s.tipo === "Drop Set"
              ? "D"
              : s.tipo === "Failure Set"
                ? "F"
                : s.tipo === "Warm Up Set"
                  ? "W"
                  : idx + 1}
          </Text>

          <Text style={styles.cell}>{s.peso}kg</Text>
          <Text style={styles.cell}>{s.repeticiones}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "transparent",
    marginBottom: 20,
    width: "100%",
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
    width: "95%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingLeft: 16,
  },
  headerSets: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    flexShrink: 1,
  },
  label: {
    color: "#ccc",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
    width: "33%",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  cell: {
    width: "33%",
    textAlign: "center",
    color: "black",
  },
});
