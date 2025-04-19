import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  RefreshControl,
} from "react-native";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";

const mockHistorial = [
  {
    nombre: "Push ligero",
    fecha: "2025-04-01",
    nombre_ejercicio: "Triceps Kickbacks",
    series: [
      { tipo: "Calentamiento", repeticiones: 15, peso: "2.00" },
      { tipo: "Normal", repeticiones: 12, peso: "4.00" },
      { tipo: "Normal", repeticiones: 10, peso: "5.00" },
      { tipo: "Normal", repeticiones: 10, peso: "5.00" },
      { tipo: "Normal", repeticiones: 8, peso: "6.00" },
    ],
  },
  {
    nombre: "Empuje intermedio",
    fecha: "2025-04-05",
    nombre_ejercicio: "Triceps Kickbacks",
    series: [
      { tipo: "Calentamiento", repeticiones: 15, peso: "2.50" },
      { tipo: "Normal", repeticiones: 12, peso: "5.00" },
      { tipo: "Normal", repeticiones: 10, peso: "6.00" },
      { tipo: "Normal", repeticiones: 8, peso: "6.00" },
      { tipo: "Normal", repeticiones: 8, peso: "6.50" },
    ],
  },
  {
    nombre: "Empuje pesado",
    fecha: "2025-04-09",
    nombre_ejercicio: "Triceps Kickbacks",
    series: [
      { tipo: "Calentamiento", repeticiones: 12, peso: "3.00" },
      { tipo: "Normal", repeticiones: 10, peso: "6.00" },
      { tipo: "Normal", repeticiones: 10, peso: "6.50" },
      { tipo: "Normal", repeticiones: 8, peso: "7.00" },
      { tipo: "Normal", repeticiones: 6, peso: "7.50" },
    ],
  },
  {
    nombre: "Push controlado",
    fecha: "2025-04-13",
    nombre_ejercicio: "Triceps Kickbacks",
    series: [
      { tipo: "Calentamiento", repeticiones: 15, peso: "2.50" },
      { tipo: "Normal", repeticiones: 12, peso: "5.50" },
      { tipo: "Normal", repeticiones: 10, peso: "6.00" },
      { tipo: "Normal", repeticiones: 10, peso: "6.50" },
      { tipo: "Normal", repeticiones: 8, peso: "7.00" },
    ],
  },
];

export default function HistoryExerciseScreen() {
  const fetchWithAuth = useFetchWithAuth();

  const [sessions, setSessions] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchSessions = async () => {
    // try {
    //   setRefreshing(true);
    //   const response = await fetchWithAuth(
    //     "http://localhost:8000/ejercicio/<id>/history/",
    //     {
    //       method: "GET",
    //     }
    //   );

    //   setRefreshing(false);

    //   const data = await response.json();
    setSessions(mockHistorial);

    //   if (response.ok) {
    //     return { success: true, data };
    //   } else {
    //     return { success: false, error: data.error || "Server not available" };
    //   }
    // } catch (error) {
    //   return { success: false, error };
    // }
  };

  React.useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchSessions} /> // RefresControl es para deslizar hacia abajo y recargar
        }
      >
        {sessions.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.sesionTitulo}>{item.nombre}</Text>
            <Text style={styles.fecha}>{item.fecha}</Text>

            <Text style={styles.ejercicioTitulo}>{item.nombre_ejercicio}</Text>
            <View style={styles.serieRow}>
              <Text style={styles.textoTipo}> Sets</Text>
              <Text style={styles.textoTipo}> Weight x Reps</Text>
            </View>
            {item.series.map((serie, idx) => (
              <View key={idx} style={styles.serieRow}>
                <Text style={styles.tipo}>{serie.tipo}</Text>
                <Text style={styles.pesoReps}>
                  {`${serie.peso}kg x ${serie.repeticiones}reps`}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  sesionTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  fecha: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  ejercicioTitulo: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 4,
    color: "black",
  },
  serieRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  tipo: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
    marginRight: 8,
  },
  pesoReps: {
    fontSize: 14,
    color: "#333",
  },
  textoTipo: {
    fontSize: 14,
    color: "#777",
    marginRight: 8,
  },
});
