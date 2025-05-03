import { Text, ScrollView, View, Pressable, StyleSheet } from "react-native";
import { Entypo } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { ResumeWorkoutAS } from "../ResumeWorkoutAS";
import { SafeAreaView } from "react-native-safe-area-context";
import { WorkoutContext } from "../../context/WorkoutContext";

export default function TrainScreen() {
  const { isWorkoutActive } = useContext(WorkoutContext);
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollcontainer}>
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
          onPress={() => console.log("Create routine")}
        >
          <Entypo
            color="white"
            name="open-book"
            size={24}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.textButton}>Create routine</Text>
        </Pressable>
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
    backgroundColor: "grey",
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
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
  // rowCard: {
  //   flexDirection: "row",
  //   alignContent: "center",
  // },
});
