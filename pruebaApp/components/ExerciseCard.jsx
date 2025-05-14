import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { WorkoutTrainContext } from "../context/WorkoutTrainContext";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { Entypo, Feather } from "@expo/vector-icons";

export const ExerciseCard = ({ ejercicio }) => {
  const navigation = useNavigation();
  const [isExerciseTypeVisible, setIsExerciseTypeVisible] = useState(false);
  const [setModalIndex, setSetModalIndex] = useState(null);
  const [isExerciseDotsVisible, setIsExerciseDotsVisible] = useState(false);
  const { exerciseProgress, setExerciseProgress, setSelectedExercises } =
    useContext(WorkoutTrainContext);
  const progresoActual = exerciseProgress[ejercicio.idEjercicio];
  const seriesAnteriores =
    progresoActual?.length > 0
      ? progresoActual
      : ejercicio.ultima_sesion?.series || [];
  const seriesAnteriorSesion = ejercicio.ultima_sesion?.series || [];
  const initialState = //Si no hay series anteriores en ese ejercicio, metemos una por defecto con valores a 0
    seriesAnteriores.length > 0
      ? seriesAnteriores
      : [{ peso: 0, repeticiones: 0, tipo: "Normal", checked: false }];
  const [series, setSeries] = useState(initialState);
  const [tempInputs, setTempInputs] = useState(
    //manejo de los input (cuando se edita el textInput pero no se le da al OK)
    series.map((s) => ({
      peso: s.peso,
      repeticiones: s.repeticiones,
      tipo: "Normal",
      checked: false,
    }))
  );

  const ejercicioId = ejercicio.idEjercicio;

  const handleConfirmSeries = (index) => {
    const newdata = [...series];
    newdata[index] = {
      ...newdata[index],
      tipo: tempInputs[index].tipo,
      peso: tempInputs[index].peso,
      repeticiones: tempInputs[index].repeticiones,
      checked: !series[index].checked, //por si se desmarca la casilla
    };
    setSeries(newdata);

    // Actualizar el contexto global
    setExerciseProgress((prev) => ({
      ...prev,
      [ejercicioId]: newdata,
    }));
  };

  const handleTempChange = (index, field, value) => {
    //field = peso o repeticiones y value el valor que introduce el usuario
    setTempInputs((prev) => {
      const newdata = prev.map((input, i) =>
        i === index ? { ...input, [field]: value } : input
      );
      if (series[index].checked) {
        //Si el textInput está puesto a checked actualiza directamente el contexto
        const newSeries = [...series];
        newSeries[index] = {
          ...newSeries[index],
          [field]: value,
        };

        setTimeout(() => {
          //le meto un setTimeout para que haga esta acción al final del renderizado y no de fallos
          setExerciseProgress((prevProgress) => ({
            ...prevProgress,
            [ejercicioId]: newSeries,
          }));
        }, 0);
      }
      return newdata;
    });
  };

  const addSet = () => {
    const newset = { peso: 0, repeticiones: 0, tipo: "Normal", checked: false };
    setSeries((prev) => [...prev, newset]);
    setTempInputs((prev) => [...prev, newset]);
  };

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
          <Image source={{ uri: ejercicio.imagen }} style={styles.image} />
          <Text style={styles.title}>{ejercicio.nombre}</Text>
        </View>
        <Pressable onPress={() => setIsExerciseDotsVisible(true)}>
          <Entypo name="dots-three-vertical" size={18} />
        </Pressable>
      </Pressable>
      <Modal
        isVisible={isExerciseDotsVisible}
        onBackdropPress={() => setIsExerciseDotsVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalOptions}>
            {[
              {
                label: "Reorder Exercises",
                icon: "select-arrows",
                onPress: () => console.log("Reorder"),
              },
              {
                label: "Remove Exercise",
                icon: "x",
                destructive: true,
                onPress: () => {
                  setExerciseProgress((prev) => {
                    const newProgress = { ...prev };
                    delete newProgress[ejercicioId];
                    return newProgress;
                  });
                  setSelectedExercises((prev) =>
                    prev.filter((id) => id !== ejercicioId)
                  );
                },
              },
            ].map((item, index) => (
              <Pressable
                key={index}
                style={[styles.modalOptionRow, item.destructive]}
                onPress={() => {
                  item.onPress();
                  setIsExerciseDotsVisible(false);
                }}
              >
                <View style={styles.modalOptionInner}>
                  {item.label === "Reorder Exercises" ? (
                    <Entypo
                      name={item.icon}
                      size={20}
                      color={item.destructive ? "#FF3B30" : "#FFF"}
                      style={styles.modalOptionIcon}
                    />
                  ) : (
                    <Feather
                      name={item.icon}
                      size={20}
                      color={item.destructive ? "#FF3B30" : "#FFF"}
                      style={styles.modalOptionIcon}
                    />
                  )}

                  <Text
                    style={[
                      styles.modalOptionText,
                      item.destructive && { color: "#FF3B30" },
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      <View style={styles.headerSets}>
        <Text style={styles.label}>SET</Text>
        <Text style={styles.label}>PREVIOUS</Text>
        <Text style={styles.label}>KG</Text>
        <Text style={styles.label}>REPS</Text>
        <Text style={styles.label}>✔</Text>
      </View>

      {isExerciseTypeVisible && setModalIndex !== null && (
        <Modal
          isVisible={isExerciseTypeVisible}
          onBackdropPress={() => {
            setIsExerciseTypeVisible(false);
            setSetModalIndex(null);
          }}
          style={{ justifyContent: "flex-end", margin: 0 }}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Set Type:</Text>
            <View style={styles.separator} />
            <View style={styles.modalOptions}>
              {[
                { label: "1  Normal", tipo: "Normal" },
                {
                  label: "D  Drop Set",
                  tipo: "Drop Set",
                },
                {
                  label: "F  Failure Set",
                  tipo: "Failure Set",
                },
                { label: "W  Warm Up Set", tipo: "Warm Up Set" },
                {
                  label: "X  Delete Set",
                  tipo: "DELETE",
                  destructive: true,
                },
              ].map((item, optionIdx) => (
                <Pressable
                  key={optionIdx}
                  style={styles.modalOptionRow}
                  onPress={() => {
                    const idx = setModalIndex;
                    setIsExerciseTypeVisible(false);
                    setSetModalIndex(null);

                    if (item.tipo === "DELETE") {
                      // Eliminar set de los arrays (.filter devuelve un nuevo array con los elementos que devuelvan true de la condición)
                      setSeries((prev) => prev.filter((_, i) => i !== idx));
                      setTempInputs((prev) => prev.filter((_, i) => i !== idx));

                      // Actualizar si esta el checked
                      setExerciseProgress((prev) => {
                        const newdata = [...(prev[ejercicioId] || [])].filter(
                          (_, i) => i !== idx
                        );
                        return {
                          ...prev,
                          [ejercicioId]: newdata,
                        };
                      });
                      return;
                    }

                    // Actualizar tipo
                    setTempInputs((prev) => {
                      const updated = [...prev];
                      updated[idx] = { ...updated[idx], tipo: item.tipo };
                      return updated;
                    });

                    // Si estaba a checked, actualizar el progreso tambien
                    if (series[idx].checked) {
                      const updatedSeries = [...series];
                      updatedSeries[idx] = {
                        ...updatedSeries[idx],
                        tipo: item.tipo,
                      };
                      setSeries(updatedSeries);
                      setExerciseProgress((prev) => ({
                        ...prev,
                        [ejercicioId]: updatedSeries,
                      }));
                    }
                  }}
                >
                  <View style={styles.modalOptionInner}>
                    <Text
                      style={[
                        styles.modalOptionText,
                        item.destructive && { color: "#FF3B30" },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </Modal>
      )}
      {series.map((s, idx) => (
        <View
          key={idx}
          style={[styles.row, s.checked && { backgroundColor: "#e6f7ea" }]}
        >
          <Pressable
            style={styles.cellButton}
            // onPress={() => handleTipoSelectSheet(idx)}
            onPress={() => {
              setIsExerciseTypeVisible(true);
              setSetModalIndex(idx);
            }}
          >
            <Text
              style={{
                color:
                  tempInputs[idx]?.tipo === "Drop Set"
                    ? "blue"
                    : tempInputs[idx]?.tipo === "Failure Set"
                      ? "red"
                      : tempInputs[idx]?.tipo === "Warm Up Set"
                        ? "#FFD700"
                        : "black",
                fontWeight: "bold",
              }}
            >
              {tempInputs[idx]?.tipo === "Drop Set"
                ? "D"
                : tempInputs[idx]?.tipo === "Failure Set"
                  ? "F"
                  : tempInputs[idx]?.tipo === "Warm Up Set"
                    ? "W"
                    : idx + 1}
            </Text>
          </Pressable>
          <Text style={styles.cell}>
            {idx < seriesAnteriorSesion.length
              ? `${seriesAnteriorSesion[idx].peso}kg x ${seriesAnteriorSesion[idx].repeticiones}`
              : "----"}
          </Text>
          <TextInput
            style={styles.cell}
            keyboardType="decimal-pad"
            placeholder={`${seriesAnteriores[idx]?.peso ?? 0}`}
            value={tempInputs[idx].peso.toString()}
            maxLength={5}
            onChangeText={(text) =>
              handleTempChange(idx, "peso", parseFloat(text) || 0)
            }
          />

          <TextInput
            style={styles.cell}
            keyboardType="numeric"
            placeholder={`${seriesAnteriores[idx]?.repeticiones ?? 0}`}
            value={tempInputs[idx].repeticiones.toString()}
            maxLength={3}
            onChangeText={(text) =>
              handleTempChange(idx, "repeticiones", parseInt(text) || 0)
            }
          />
          <Pressable
            style={styles.cellButton}
            onPress={() => {
              handleConfirmSeries(idx);
            }}
          >
            <Ionicons
              name={s.checked ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={s.checked ? "#4CAF50" : "#ccc"}
            />
          </Pressable>
        </View>
      ))}

      {/* Botón para añadir set */}
      <Pressable
        style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.6 }]}
        onPress={addSet}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Set</Text>
      </Pressable>
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
    color: "#3498db",
    flexShrink: 1,
  },
  label: {
    color: "#ccc",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 4,
    width: "20%",
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
    width: "20%",
    textAlign: "center",
    color: "black",
  },
  cellButton: {
    width: "20%",
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#444",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalContent: {
    backgroundColor: "#63666A",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 16,
  },
  modalOptions: {
    color: "white",
    fontSize: 30,
    marginBottom: 8,
  },
  modalOptionText: {
    color: "white",
    fontSize: 14,
  },
  modalOptionRow: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 0.5,
    borderColor: "#3a3a3c",
    borderRadius: 8,
  },
  modalOptionInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalOptionIcon: {
    marginRight: 16,
  },
});
