import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable, BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useContext } from "react";
import { WorkoutContext } from "../../context/WorkoutContext";
import { useNavigation } from "@react-navigation/native";

export const WorkoutSession = () => {
  const navigation = useNavigation();
  const { seconds, volume, sets, setVolume, setSets, setIsWorkoutActive } =
    useContext(WorkoutContext);

  useEffect(() => {
    setIsWorkoutActive(true); // activa al entrar
    return () => {}; // desactiva si abandonas
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60) % 60;
    const h = Math.floor(m / 60);
    const s = secs % 60;
    return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const addExercise = () => {
    const newSets = sets + 3;
    const newVolume = volume + 3 * 10 * 50;
    setSets(newSets);
    setVolume(newVolume);
  };

  //   const discardWorkout = () => {
  //     clearInterval(intervalRef.current);
  //     setModalVisible(false);
  //     navigation.goBack();
  //   };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workout in Progress</Text>

      <Text style={styles.infoText}>Time: {formatTime(seconds)}</Text>
      <Text style={styles.infoText}>Total Volume: {volume} kg</Text>
      <Text style={styles.infoText}>Total Sets: {sets}</Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Exercise Feed")}
      >
        <Text style={styles.buttonText}>Add Exercise</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoText: {
    fontSize: 20,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
