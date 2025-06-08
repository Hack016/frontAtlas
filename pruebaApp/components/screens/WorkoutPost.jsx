import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { BASE_URL } from "../../context/config";
import { useFetchWithAuth } from "../../utils/fetchWithAuth";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "react-native-date-picker";
import { useContext, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { WorkoutTrainContext } from "../../context/WorkoutTrainContext";
import { WorkoutTimeContext } from "../../context/WorkoutTimeContext";
import Modal from "react-native-modal";
import { WorkoutAlert } from "../../utils/Alerts/workoutAlert";
import { useNavigation } from "@react-navigation/native";
import { PostSessionAlert } from "../../utils/Alerts/PostSessionAlert";

export default function WorkoutPost() {
  const fetchWithAuth = useFetchWithAuth();
  const route = useRoute();
  const seconds = route.params?.seconds || 0;
  const navigation = useNavigation();
  const [nuevaFecha, setNuevaFecha] = useState(new Date());
  const { volume, sets, exerciseProgress, resetWorkout } =
    useContext(WorkoutTrainContext);
  const { setIsWorkoutActive, resetWorkoutTime } =
    useContext(WorkoutTimeContext);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isDurationPickerVisible, setIsDurationPickerVisible] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(Math.floor(seconds / 60));
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showNameAlert, setShowNameAlert] = useState(false);

  const handleSaveWorkout = async () => {
    const payload = {
      nombre,
      descripcion,
      tiempo: customMinutes,
      fecha: nuevaFecha.toISOString(),
      ejercicios: exerciseProgress,
    };

    // console.log("Payload:", payload);
    try {
      const response = await fetchWithAuth(`${BASE_URL}api/createSession/`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      resetWorkout();
      resetWorkoutTime();
      setIsWorkoutActive(false);
      if (response.ok) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
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

  const formatTime = (minutes) => {
    //Función para mostrar la duración del entreno en formato
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) return `${hours}h`;
      return `${hours}h ${remainingMinutes}min`;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
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
        <PostSessionAlert
          visible={showNameAlert}
          onCancel={() => setShowNameAlert(false)}
        />
        <TextInput
          style={styles.input}
          placeholder="Workout title"
          placeholderTextColor="grey"
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Add some notes about your workout or share something you want to say"
          placeholderTextColor="grey"
          value={descripcion}
          onChangeText={setDescripcion}
        />

        <View style={styles.row}>
          <Text style={styles.label}>Duration</Text>
          <Pressable onPress={() => setIsDurationPickerVisible(true)}>
            <Text style={styles.value}>{formatTime(customMinutes)}</Text>
          </Pressable>
        </View>

        {/* Modal Picker de minutos */}
        <Modal
          isVisible={isDurationPickerVisible}
          onBackdropPress={() => setIsDurationPickerVisible(false)}
          style={{ justifyContent: "flex-end", margin: 0 }}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Workout Duration</Text>
            <View style={styles.separator}></View>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={customMinutes}
                onValueChange={(itemValue) => setCustomMinutes(itemValue)}
                itemStyle={styles.pickerItem}
              >
                {Array.from({ length: 300 }, (_, i) => i + 1).map((minute) => (
                  <Picker.Item
                    key={minute}
                    label={formatTime(minute)}
                    value={minute}
                  />
                ))}
              </Picker>
            </View>
            <Pressable
              style={styles.doneButton}
              onPress={() => setIsDurationPickerVisible(false)}
            >
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          </View>
        </Modal>
        <View style={styles.row}>
          <Text style={styles.label}>Volume</Text>
          <Text style={styles.value}>{volume ? volume : "0"} kg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Sets</Text>
          <Text style={styles.value}>{sets ? sets : "0"}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.row}>
          <Text style={styles.label}>When</Text>
          <Pressable
            onPress={() => {
              setOpenDatePicker(true);
            }}
          >
            <Text style={styles.value}>
              {nuevaFecha
                ? nuevaFecha.toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "Select a date"}
            </Text>
          </Pressable>
        </View>

        <DatePicker
          modal
          open={openDatePicker}
          date={nuevaFecha}
          mode="datetime"
          maximumDate={new Date()}
          onConfirm={(date) => {
            setOpenDatePicker(false);
            setNuevaFecha(date);
          }}
          onCancel={() => {
            setOpenDatePicker(false);
          }}
        />
        <View style={styles.separator} />

        <View style={styles.bottomrow}>
          <Pressable
            style={({ pressed }) => [
              pressed
                ? { ...styles.bottomButton, opacity: 0.6 }
                : styles.bottomButton,
            ]}
            onPress={() => setShowAlert(true)}
          >
            <Text style={styles.discardText}>Discard Workout</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              pressed
                ? { ...styles.bottomButton, opacity: 0.6 }
                : styles.bottomButton,
            ]}
            onPress={() => {
              if (nombre.trim().length > 0) {
                handleSaveWorkout();
              } else {
                setShowNameAlert(true);
              }
            }}
          >
            <Text style={styles.saveText}>Save workout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
  },
  input: {
    color: "black",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    marginBottom: 24,
    marginTop: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
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
  divider: {
    borderWidth: 1,
    borderColor: "white",
  },
  pickerContainer: {
    backgroundColor: "transparent",
    borderRadius: 12,
    marginBottom: 16,
  },
  pickerItem: {
    color: "white",
    fontSize: 20,
    height: 120,
  },
  doneButton: {
    backgroundColor: "#fff",
    borderRadius: 32,
    paddingVertical: 12,
    alignItems: "center",
  },
  doneText: {
    color: "grey",
    fontWeight: "600",
    fontSize: 16,
  },
  label: {
    color: "grey",
    fontSize: 15,
  },
  value: {
    color: "#2196F3",
    fontSize: 15,
  },
  separator: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 16,
  },
  textArea: {
    color: "black",
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  bottomButton: {
    marginTop: 32,
    alignItems: "center",
  },
  discardText: {
    color: "red",
    fontSize: 16,
  },
  saveText: {
    color: "#2196F3",
    fontSize: 16,
  },
  bottomrow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
