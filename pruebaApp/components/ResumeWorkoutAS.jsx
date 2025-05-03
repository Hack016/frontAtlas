import { View, Text, StyleSheet, Pressable } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  useNavigation,
  useNavigationState,
  useFocusEffect,
} from "@react-navigation/native";
import { useContext, useCallback } from "react";
import { WorkoutContext } from "../context/WorkoutContext";

export const ResumeWorkoutAS = () => {
  const { isWorkoutActive, resetWorkout } = useContext(WorkoutContext);
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();
  const navigationState = useNavigationState((state) => state);
  const currentRouteName =
    navigationState?.routes?.[navigationState.index]?.name || "";

  useFocusEffect(
    useCallback(() => {
      // Esta función se ejecuta cada vez que la pantalla donde se monta el banner entra en foco
      // Ideal para refrescar cosas al volver desde otra pantalla
      // En este caso no hacemos nada aquí directamente, pero podrías usarlo si necesitas lógica futura

      // cleanup opcional si lo necesitas:
      return () => {
        // Se ejecuta cuando la pantalla pierde el foco
      };
    }, [currentRouteName, isWorkoutActive])
  );

  // Mostrar solo si hay sesión activa y NO estás en la pantalla WorkoutSession
  if (!isWorkoutActive || currentRouteName === "Workout Session") {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Workout in progress</Text>
      <View style={styles.buttons}>
        <Pressable onPress={() => navigation.navigate("Workout Session")}>
          <Text style={styles.resume}>Continue</Text>
        </Pressable>
        <Pressable onPress={() => resetWorkout()}>
          <Text style={styles.cancel}>Discard</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#222",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: { color: "#fff" },
  buttons: { flexDirection: "row", gap: 20 },
  resume: { color: "skyblue", marginRight: 20 },
  cancel: { color: "red" },
});
