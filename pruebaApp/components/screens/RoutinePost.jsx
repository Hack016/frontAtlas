import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { BASE_URL } from "../../context/config";
import { ExerciseRoutineCard } from "../Cards/ExerciseRoutineCard";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { SaveRoutineAlert } from "../../utils/Alerts/SaveRoutineAlert";
import { NameRoutineAlert } from "../../utils/Alerts/NameRoutineAlert";
import { DiscardRoutineAlert } from "../../utils/Alerts/DiscardRoutineAlert";

export const RoutinePost = () => {
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [showNameAlert, setShowNameAlert] = useState(false);
  const [showDiscardAlert, setShowDiscardAlert] = useState(false);
  const [pendingNavigationEvent, setPendingNavigationEvent] = useState(null); // Variable para almacenar el evento de navegación pendiente
  const [isSavingAndExiting, setIsSavingAndExiting] = useState(false); // Variable para ignorar la navegación pendiente

  const [nombre, setNombre] = useState("");
  const navigation = useNavigation();
  const fetchWithAuth = useFetchWithAuth();
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [exerciseProgress, setExerciseProgress] = useState({});
  const hasAnyExercise = Object.values(exerciseProgress).some(
    (seriesList) => seriesList.length > 0
  );

  useEffect(() => {
    const unsub = navigation.addListener("beforeRemove", (e) => {
      if (isSavingAndExiting) return;
      e.preventDefault(); // detener la salida por defecto
      setPendingNavigationEvent(e);
      setShowDiscardAlert(true);
    });

    return unsub;
  }, [navigation, isSavingAndExiting]);

  const fetchExercises = async () => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/getSessionExercises/`,
        {
          method: "POST",
          body: JSON.stringify({ ids: selectedExercises }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Ordeno los ejercicios por el orden de selectedExercises
        const ordered = selectedExercises.map((id) =>
          data.find((ej) => ej.idEjercicio === id)
        );

        setExercises(ordered);

        const initialProgress = { ...exerciseProgress }; // conservar lo que ya hay
        data.forEach((ej) => {
          if (!initialProgress[ej.idEjercicio]) {
            const seriesAnt = ej.ultima_sesion?.series || [];
            initialProgress[ej.idEjercicio] =
              seriesAnt.length > 0
                ? seriesAnt.map(({ tipo, peso, repeticiones }) => ({
                    tipo,
                    peso,
                    repeticiones,
                  }))
                : [
                    {
                      tipo: "normal",
                      peso: 0,
                      repeticiones: 0,
                    },
                  ];
          }
        });
        setExerciseProgress(initialProgress);
      } else {
        console.error("Failed: server error");
      }
    } catch (error) {
      console.error("Failed to fetch exercises", error);
    }
  };

  const handleSaveWorkout = async () => {
    const cleanedProgress = {}; //Porque en el backend los atributos peso y repeticiones los llamo así
    Object.entries(exerciseProgress).forEach(([id, series]) => {
      cleanedProgress[id] = series.map(({ tipo, peso, repeticiones }) => ({
        tipo,
        peso_estimado: peso,
        repeticiones_estimadas: repeticiones,
      }));
    });
    const payload = {
      nombre,
      ejercicios: cleanedProgress,
    };

    try {
      const response = await fetchWithAuth(`${BASE_URL}api/createroutine/`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSavingAndExiting(true);
        setTimeout(() => {
          // Meter setTimeout para darle tiempo al setIsSavingAndExiting a ponerse a true
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        }, 0);
      } else {
        const errorData = await response.json();
        console.log("Save error details:", errorData);

        Alert.alert("Error", errorData.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Save failed", error);
      Alert.alert("Error", "Network error.");
    }
  };

  useEffect(() => {
    if (selectedExercises.length > 0) {
      fetchExercises();
    }
  }, [selectedExercises]);

  return (
    <View style={styles.container}>
      <SaveRoutineAlert
        visible={showSaveAlert}
        onCancel={() => setShowSaveAlert(false)}
        onPost={() => {
          setShowSaveAlert(false);
          handleSaveWorkout();
        }}
      />
      <NameRoutineAlert
        visible={showNameAlert}
        onCancel={() => setShowNameAlert(false)}
      />
      <DiscardRoutineAlert
        visible={showDiscardAlert}
        onCancel={() => setShowDiscardAlert(false)}
        onDiscard={() => {
          if (pendingNavigationEvent) {
            navigation.dispatch(pendingNavigationEvent.data.action);
          }
          setShowDiscardAlert(false);
          setPendingNavigationEvent(null); // limpiar
        }}
      />

      {selectedExercises?.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TextInput
            style={styles.input}
            placeholder="Routine title"
            placeholderTextColor="grey"
            value={nombre}
            onChangeText={setNombre}
          />
          {exercises.map((ejercicio, index) => (
            <ExerciseRoutineCard
              key={ejercicio.idEjercicio}
              ejercicio={ejercicio}
              progreso={exerciseProgress[ejercicio.idEjercicio] || []}
              onUpdate={(newSeries) =>
                setExerciseProgress((prev) => ({
                  //actualizar el progreso de la rutina
                  ...prev,
                  [ejercicio.idEjercicio]: newSeries,
                }))
              }
              onRemove={() => {
                setExerciseProgress((prev) => {
                  //eliminar un ejercicio de la rutina. Se utilizan funciones callBack porque ahora no uso context
                  const updated = { ...prev };
                  delete updated[ejercicio.idEjercicio];
                  return updated;
                });
                setSelectedExercises((prev) =>
                  prev.filter((id) => id !== ejercicio.idEjercicio)
                );
              }}
            />
          ))}
          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) =>
                pressed ? { ...styles.button, opacity: 0.5 } : styles.button
              }
              onPress={() =>
                navigation.navigate("Exercise Feed", {
                  //La función onAddExercises se podrá llamar en el hijo (ExerciseFeed) y así podremos pasar datos usando goback()
                  onAddExercises: (ejerciciosNuevos) => {
                    //Combinar actuales con los que le pasan por parametro ExerciseFeed
                    setSelectedExercises((prev) => [
                      ...prev,
                      ...ejerciciosNuevos.filter(
                        (ej) => !prev.some((e) => e === ej)
                      ),
                    ]);
                  },
                })
              }
            >
              <View style={styles.buttonRow}>
                <Entypo name="plus" size={24} color="white" />
                <Text style={styles.buttonText}>Add Exercise</Text>
              </View>
            </Pressable>
            <View style={styles.bottomRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.buttonPost,
                  pressed && { opacity: 0.6 },
                ]}
                onPress={() => {
                  if (nombre.trim().length > 0) {
                    setShowSaveAlert(true);
                  } else {
                    setShowNameAlert(true);
                  }
                }}
                disabled={
                  !hasAnyExercise // mirar si hay algún ejercicio añadido
                }
              >
                <Text
                  style={[
                    styles.buttonTextPost,
                    {
                      color: !hasAnyExercise ? "grey" : "#2196F3",
                    },
                  ]}
                >
                  Save routine
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.noExerciseContainer}>
          <TextInput
            style={styles.input}
            placeholder="Routine title"
            placeholderTextColor="grey"
            value={nombre}
            onChangeText={setNombre}
          />
          <View style={styles.noExerciseMessageContainer}>
            <FontAwesome6 name="dumbbell" size={45} color={"grey"} />
            <Text style={styles.noExercisesText}>
              Consistency is the true weight we carry
            </Text>
            <Text style={styles.noExercisesText2}>
              Add an exercise to get started
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) =>
                pressed ? { ...styles.button, opacity: 0.5 } : styles.button
              }
              onPress={() =>
                navigation.navigate("Exercise Feed", {
                  //La función onAddExercises se podrá llamar en el hijo (ExerciseFeed) y así puedo pasar datos usando goback()
                  onAddExercises: (ejerciciosNuevos) => {
                    //Combinar actuales con los que le pasan por parametro ExerciseFeed
                    setSelectedExercises((prev) => [
                      ...prev,
                      ...ejerciciosNuevos.filter(
                        (ej) => !prev.some((e) => e === ej)
                      ),
                    ]);
                  },
                })
              }
            >
              <View style={styles.buttonRow}>
                <Entypo name="plus" size={24} color="white" />
                <Text style={styles.buttonText}>Add Exercise</Text>
              </View>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 20,
  },
  noExerciseContainer: {
    paddingVertical: 20,
  },
  input: {
    alignSelf: "center",
    width: "90%",
    color: "black",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    marginBottom: 24,
    marginTop: 12,
    fontSize: 16,
  },
  noExerciseMessageContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  noExercisesText: {
    fontSize: 15,
    marginBottom: 8,
    marginTop: 12,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  noExercisesText2: {
    color: "grey",
    fontSize: 13,
    marginBottom: 12,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    margin: 10,
    backgroundColor: "white",
    borderColor: "#2196F3",
    borderWidth: 1,
    borderRadius: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 12,
    marginBottom: 8,
    color: "grey",
    width: "33%",
    textAlign: "center",
  },
  infoData: {
    fontSize: 14,
    marginBottom: 8,
    color: "grey",
    width: "33%",
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    backgroundColor: "transparent",
  },
  button: {
    marginTop: 12,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  bottomRow: {
    flexDirection: "row",
  },
  buttonDeleteWOFlex: {
    marginTop: 12,
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDelete: {
    flex: 1,
    marginTop: 12,
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonPost: {
    flex: 1,
    marginTop: 12,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    borderColor: "#2196F3",
    borderWidth: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonTextDelete: {
    color: "#EE4B2B",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonTextPost: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
});
