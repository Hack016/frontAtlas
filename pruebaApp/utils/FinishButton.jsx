import React, { useContext } from "react";
import { Pressable, Text } from "react-native";
import { WorkoutContext } from "../context/WorkoutContext";
import { useNavigation } from "@react-navigation/native";

export const FinishButton = () => {
  //Botón para finalizar sesión y redirigir a la última pantalla antes de publicar
  const { exerciseProgress } = useContext(WorkoutContext);
  const navigation = useNavigation();

  const isEnabled = Object.values(exerciseProgress).some((seriesList) =>
    seriesList.some((s) => s.checked)
  );

  const handleFinish = () => {
    if (!isEnabled) return;
    navigation.navigate("WorkoutPost");
    // console.log("Le he pulsado");
  };

  return (
    <Pressable
      onPress={() => handleFinish()}
      disabled={!isEnabled}
      style={({ pressed }) => [pressed && { opacity: 0.6 }]}
    >
      <Text
        style={{ color: isEnabled ? "#2196F3" : "grey", fontWeight: "bold" }}
      >
        Finish
      </Text>
    </Pressable>
  );
};
