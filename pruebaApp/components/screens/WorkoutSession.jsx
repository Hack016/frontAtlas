import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useContext, useState } from "react";
import { WorkoutTimeContext } from "../../context/WorkoutTimeContext";
import { WorkoutTrainContext } from "../../context/WorkoutTrainContext";
import { useNavigation } from "@react-navigation/native";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { BASE_URL } from "../../context/config";
import { ExerciseCard } from "../ExerciseCard";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { WorkoutAlert } from "../../utils/workoutAlert";

export const WorkoutSession = () => {
  const [showAlert, setShowAlert] = useState(false);
  const navigation = useNavigation();
  const fetchWithAuth = useFetchWithAuth();
  const {
    volume,
    sets,
    setVolume,
    setSets,
    selectedExercises,
    setSelectedExercises,
    setExercises,
    exercises,
    exerciseProgress,
    setExerciseProgress,
    resetWorkout,
  } = useContext(WorkoutTrainContext);
  const { seconds, setIsWorkoutActive, resetWorkoutTime } =
    useContext(WorkoutTimeContext);

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
        setExercises(data);
        const initialProgress = { ...exerciseProgress }; // conservar lo que ya hay
        data.forEach((ej) => {
          if (!initialProgress[ej.idEjercicio]) {
            const seriesAnt = ej.ultima_sesion?.series || [];
            initialProgress[ej.idEjercicio] =
              seriesAnt.length > 0
                ? seriesAnt.map((s) => ({ ...s, checked: false }))
                : [
                    {
                      tipo: "normal",
                      peso: 0,
                      repeticiones: 0,
                      checked: false,
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

  useEffect(() => {
    setIsWorkoutActive(true); // activa al entrar
    if (selectedExercises.length > 0) {
      fetchExercises();
    }
  }, [selectedExercises]);

  useEffect(() => {
    let totalVolume = 0;
    let totalSets = 0;

    Object.values(exerciseProgress).forEach((seriesList) => {
      seriesList.forEach((s) => {
        if (s.checked) {
          totalVolume += s.peso * s.repeticiones;
          totalSets += 1;
        }
      });
    });
    // console.log("AL ENTRAR - progress:", exerciseProgress);

    setVolume(totalVolume);
    setSets(totalSets);
  }, [exerciseProgress]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60) % 60;
    const h = Math.floor(m / 60);
    const s = secs % 60;
    return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <View style={styles.container}>
      <WorkoutAlert
        visible={showAlert}
        onCancel={() => setShowAlert(false)}
        onDiscard={() => {
          resetWorkout();
          resetWorkoutTime();
          setShowAlert(false);
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        }}
      />
      <View style={styles.headerContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Duration</Text>
          <Text style={styles.infoText}>Volume</Text>
          <Text style={styles.infoText}>Sets</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoData}>{formatTime(seconds)}</Text>
          <Text style={styles.infoData}>{volume} kg</Text>
          <Text style={styles.infoData}>{sets}</Text>
        </View>
      </View>

      {selectedExercises?.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {exercises.map((ejercicio, index) => (
            <ExerciseCard key={ejercicio.idEjercicio} ejercicio={ejercicio} /> //llamo a exerciseCard para no meter todo el código aquí
          ))}
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.button}
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
                onPress={() =>
                  navigation.navigate("WorkoutPost", { seconds: seconds })
                }
                disabled={
                  !Object.values(exerciseProgress).some((seriesList) =>
                    seriesList.some((s) => s.checked)
                  ) // mirar si hay algun dato guardado en el exerciseProgress. Si lo hay ya se puede publicar y se activa el botón
                }
              >
                <Text
                  style={[
                    styles.buttonTextPost,
                    {
                      color: !Object.values(exerciseProgress).some(
                        (seriesList) => seriesList.some((s) => s.checked)
                      )
                        ? "grey"
                        : "#2196F3",
                    },
                  ]}
                >
                  Save workout
                </Text>
              </Pressable>
              <Pressable
                style={styles.buttonDelete}
                onPress={() => setShowAlert(true)}
              >
                <Text style={styles.buttonTextDelete}>Discard Workout</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.noExerciseContainer}>
          <View style={styles.noExerciseMessageContainer}>
            <FontAwesome6 name="dumbbell" size={45} color={"grey"} />
            <Text style={styles.noExercisesText}>
              Every great session begins with a single lift
            </Text>
            <Text style={styles.noExercisesText2}>
              Add an exercise to start your workout
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.button}
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
            <Pressable
              style={styles.buttonDeleteWOFlex}
              onPress={() => setShowAlert(true)}
            >
              <Text style={styles.buttonTextDelete}>Discard Workout</Text>
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
