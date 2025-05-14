import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useContext } from "react";
import { WorkoutTimeContext } from "../context/WorkoutTimeContext";
import { WorkoutTrainContext } from "../context/WorkoutTrainContext";
import { Entypo } from "react-native-vector-icons";
import { WorkoutAlert } from "../utils/workoutAlert";
import { useState } from "react";

export const ResumeWorkoutAS = () => {
  const [showAlert, setShowAlert] = useState(false);
  const { isWorkoutActive, resetWorkoutTime } = useContext(WorkoutTimeContext);
  const { resetWorkout } = useContext(WorkoutTrainContext);
  const navigation = useNavigation();
  const navigationState = useNavigationState((state) => state);
  const currentRouteName =
    navigationState?.routes?.[navigationState.index]?.name || "";

  // Mostrar solo si hay sesión activa y NO estás en la pantalla WorkoutSession
  if (!isWorkoutActive || currentRouteName === "Workout Session") {
    return null;
  }

  return (
    <View style={styles.container}>
      <WorkoutAlert
        visible={showAlert}
        onCancel={() => setShowAlert(false)}
        onDiscard={() => {
          resetWorkout();
          resetWorkoutTime();
          setShowAlert(false);
        }}
      />
      <Text style={styles.text}>Workout in progress</Text>
      <View style={styles.buttons}>
        <Pressable
          style={styles.pressableRow}
          onPress={() => navigation.navigate("Workout Session")}
        >
          <Entypo name="triangle-right" size={24} color="skyblue" />
          <Text style={styles.resume}>Resume</Text>
        </Pressable>
        {/* <Pressable style={styles.pressableRow} onPress={() => resetWorkout()}>
          <Entypo name="cross" size={24} color="red" />
          <Text style={styles.cancel}>Discard</Text>
        </Pressable> */}
        <Pressable
          style={styles.pressableRow}
          onPress={() => setShowAlert(true)}
        >
          <Entypo name="cross" size={24} color="red" />
          <Text style={styles.cancel}>Discard</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "grey",
    padding: 10,
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  text: {
    color: "white",
    fontStyle: "bold",
    fontSize: 15,
  },
  buttons: {
    flexDirection: "row",
    gap: 80,
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  pressableRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  resume: {
    color: "skyblue",
    fontSize: 16,
    fontStyle: "bold",
    textAlign: "center",
  },
  cancel: {
    color: "red",
    fontStyle: "bold",
    fontSize: 15,
    textAlign: "center",
  },
});
