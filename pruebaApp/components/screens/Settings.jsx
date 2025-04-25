import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { Entypo, MaterialCommunityIcons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";

export const Settings = () => {
  const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.scrollcontainer}>
      <Text style={styles.typeSettingsText}>Account</Text>
      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <View style={styles.rowCard}>
          <MaterialCommunityIcons name="account" size={24} />
          <Text style={styles.text}>Profile</Text>
        </View>
        <Entypo name="chevron-right" size={24} />
      </Pressable>
      <Pressable style={styles.card} onPress={() => console.log("Logout")}>
        <View style={styles.rowCard}>
          <Entypo name="lock" size={24} />
          <Text style={styles.text}>Account</Text>
        </View>
        <Entypo name="chevron-right" size={24} />
      </Pressable>
      <Pressable style={styles.card} onPress={() => console.log("Logout")}>
        <View style={styles.rowCard}>
          <Entypo name="moon" size={24} />
          <Text style={styles.text}>Theme</Text>
        </View>
        <Entypo name="chevron-right" size={24} />
      </Pressable>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? { ...styles.logoutButton, opacity: 0.5 }
            : styles.logoutButton
        }
        onPress={() => console.log("Logout")}
      >
        <Text style={[styles.text, { color: "white" }]}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollcontainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  card: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  rowCard: {
    flexDirection: "row",
  },
  logoutButton: {
    backgroundColor: "#DB4437",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    alignContent: "center",
    paddingLeft: 10,
  },
  typeSettingsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "grey",
    marginBottom: 10,
  },
});
