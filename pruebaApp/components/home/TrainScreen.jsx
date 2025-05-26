import { useState, useEffect } from "react";
import {
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Entypo, EvilIcons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { ResumeWorkoutAS } from "../../utils/ResumeWorkoutAS";
import { SafeAreaView } from "react-native-safe-area-context";
import { WorkoutTimeContext } from "../../context/WorkoutTimeContext";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { BASE_URL } from "../../context/config";
import { View } from "react-native-web";
import { DeleteRoutineAlert } from "../../utils/Alerts/DeleteRoutineAlert";

export default function TrainScreen() {
  const { isWorkoutActive } = useContext(WorkoutTimeContext);
  const navigation = useNavigation();
  const fetchWithAuth = useFetchWithAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [routines, setRoutines] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchRoutinesData = async () => {
    try {
      setRefreshing(true);
      const response = await fetchWithAuth(`${BASE_URL}api/getroutines/`, {
        method: "GET",
      });

      setRefreshing(false);

      const data = await response.json();
      setRoutines(data);

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error || "Server not available" };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  const fetchRoutineDetails = async (idRutina) => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/getroutineDetail/?idRutina=${encodeURIComponent(idRutina)}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error || "Server not available" };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  const handleDeleteRoutine = async (idRutina) => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}api/deleteroutine/${encodeURIComponent(idRutina)}/`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setRoutines((prevRoutines) =>
          prevRoutines.filter((routine) => routine.idSesion !== idRutina)
        );
        return { success: true, data };
      } else {
        return { success: false, error: data.error || "Server not available" };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchRoutinesData();
  }, []);

  if (!routines) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator color="black" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollcontainer}>
        <DeleteRoutineAlert
          visible={showAlert}
          onCancel={() => setShowAlert(false)}
          onDiscard={() => {
            setShowAlert(false);
            handleDeleteRoutine(selectedId);
          }}
        />
        <Text style={styles.text}>QuickStart</Text>
        <Pressable
          style={styles.cardButton}
          onPress={() => navigation.navigate("Workout Session")}
        >
          <Entypo
            color="white"
            name="plus"
            size={24}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.textButton}>Start workout</Text>
        </Pressable>
        <Text style={styles.text}>Routines</Text>
        <Pressable
          style={styles.cardButton}
          onPress={() => navigation.navigate("Create Routine")}
        >
          <Entypo
            color="white"
            name="open-book"
            size={24}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.textButton}>Create routine</Text>
        </Pressable>
        <Text style={styles.text}>Routines created:</Text>

        {Array.isArray(routines) &&
          routines.map((routine, idx) => (
            <Pressable
              key={idx}
              style={styles.routineButton}
              onPress={() =>
                navigation.navigate("Routine", { idRutina: routine.idSesion })
              }
            >
              <View style={styles.routineRow}>
                <View>
                  <Text style={styles.textButton}>{routine.nombre}</Text>
                  <Text style={styles.subtext}>
                    {routine.ejercicios.join(", ")}
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    setSelectedId(routine.idSesion);
                    setShowAlert(true);
                  }}
                >
                  <EvilIcons name="trash" size={32} color="white" />
                </Pressable>
              </View>
              <Pressable
                style={styles.startroutineButton}
                onPress={async () => {
                  const result = await fetchRoutineDetails(routine.idSesion);
                  if (result.success) {
                    navigation.navigate("Workout Session", {
                      rutina: result.data,
                    });
                  }
                }}
              >
                <Text style={styles.textRoutineButton}>Start Routine</Text>
              </Pressable>
            </Pressable>
          ))}
        {routines.length === 0 && (
          <View style={styles.noExerciseMessageContainer}>
            <Entypo color="grey" name="open-book" size={100} />
            <Text style={styles.noExercisesText}>
              The body follows where the habit leads
            </Text>
            <Text style={styles.noExercisesText2}>
              Create your own routine and start training
            </Text>
          </View>
        )}
      </ScrollView>
      {isWorkoutActive && <ResumeWorkoutAS />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollcontainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  cardButton: {
    backgroundColor: "#4F4F4F",
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  routineButton: {
    backgroundColor: "#4F4F4F",
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    alignItems: "left",
    width: "90%",
  },
  routineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  startroutineButton: {
    backgroundColor: "#2196F3",
    marginTop: 10,
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "grey",
    paddingBottom: 10,
  },
  textButton: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  textRoutineButton: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  textRoutine: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  subtext: {
    fontSize: 16,
    color: "#B0B0B0",
  },
  noExerciseMessageContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  noExercisesText: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 12,
    fontWeight: "bold",
    color: "grey",
    fontStyle: "italic",
  },
  noExercisesText2: {
    color: "black",
    fontSize: 14,
    marginBottom: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});
