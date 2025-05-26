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
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { Entypo, Feather } from "@expo/vector-icons";
import { getExerciseImageUrl } from "../../utils/avatar";

export const ExerciseRoutineCard = ({
  ejercicio,
  progreso,
  onUpdate,
  onRemove,
}) => {
  const navigation = useNavigation();
  const [isExerciseTypeVisible, setIsExerciseTypeVisible] = useState(false);
  const [setModalIndex, setSetModalIndex] = useState(null);
  const [isExerciseDotsVisible, setIsExerciseDotsVisible] = useState(false);
  const [series, setSeries] = useState(
    progreso.length > 0
      ? progreso
      : [{ peso: 0, repeticiones: 0, tipo: "Normal" }]
  );

  const handleChange = (index, field, value) => {
    const updated = [...series];
    updated[index][field] = value;
    setSeries(updated);
    onUpdate(updated); // Llamar a la función padre para actualizar (no uso contexto para la rutina)
  };

  const addSet = () => {
    const newSet = { peso: 0, repeticiones: 0, tipo: "Normal" };
    const updated = [...series, newSet];
    setSeries(updated);
    onUpdate(updated);
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
          <Image
            source={getExerciseImageUrl(ejercicio.imagen)}
            style={styles.image}
          />
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
                onPress: onRemove,
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
        <Text style={styles.label}>KG</Text>
        <Text style={styles.label}>REPS</Text>
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
                      const updatedSeries = series.filter((_, i) => i !== idx);
                      setSeries(updatedSeries);
                      onUpdate(updatedSeries); // actualizar directamente porque ahora no hay checked
                      return;
                    }

                    const updatedSeries = [...series];
                    updatedSeries[idx] = {
                      ...updatedSeries[idx],
                      tipo: item.tipo,
                    };
                    setSeries(updatedSeries);
                    onUpdate(updatedSeries); // actualizar directamente porque ahora no hay checked
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
        <View key={idx} style={styles.row}>
          <Pressable
            style={styles.cellButton}
            onPress={() => {
              setIsExerciseTypeVisible(true);
              setSetModalIndex(idx);
            }}
          >
            <Text
              style={{
                color:
                  s.tipo === "Drop Set"
                    ? "blue"
                    : s.tipo === "Failure Set"
                      ? "red"
                      : s.tipo === "Warm Up Set"
                        ? "#FFD700"
                        : "black",
                fontWeight: "bold",
              }}
            >
              {s.tipo === "Drop Set"
                ? "D"
                : s.tipo === "Failure Set"
                  ? "F"
                  : s.tipo === "Warm Up Set"
                    ? "W"
                    : idx + 1}
            </Text>
          </Pressable>
          <TextInput
            style={styles.cell}
            keyboardType="decimal-pad"
            placeholder="0"
            value={s.peso.toString()}
            maxLength={5}
            onChangeText={(text) =>
              handleChange(idx, "peso", parseFloat(text) || 0)
            }
          />

          <TextInput
            style={styles.cell}
            keyboardType="numeric"
            placeholder="0"
            value={s.repeticiones.toString()}
            maxLength={3}
            onChangeText={(text) =>
              handleChange(idx, "repeticiones", parseInt(text) || 0)
            }
          />
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
  cellButton: {
    width: "33%",
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
