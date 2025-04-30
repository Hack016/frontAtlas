import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { Entypo, MaterialCommunityIcons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useRoute } from "@react-navigation/native";

export const AccountSettings = () => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { email, username } = route.params;
  return (
    <ScrollView contentContainerStyle={styles.scrollcontainer}>
      <Text style={styles.typeSettingsText}>Edit Account profile</Text>
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate("changeUsername", { username: username })
        }
      >
        <View style={styles.rowCard}>
          <MaterialCommunityIcons name="account" size={24} />
          <Text style={styles.text}>Change username</Text>
        </View>
        <Entypo name="chevron-right" size={24} />
      </Pressable>
      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate("changeEmail", { email: email })}
      >
        <View style={styles.rowCard}>
          <Entypo name="lock" size={24} />
          <Text style={styles.text}>Change email</Text>
        </View>
        <Entypo name="chevron-right" size={24} />
      </Pressable>
      <Pressable style={styles.card} onPress={() => console.log("Theme")}>
        <View style={styles.rowCard}>
          <Entypo name="moon" size={24} />
          <Text style={styles.text}>Update password</Text>
        </View>
        <Entypo name="chevron-right" size={24} />
      </Pressable>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? { ...styles.logoutButton, opacity: 0.5 }
            : styles.logoutButton
        }
        onPress={() => logout()}
      >
        <Text style={[styles.text, { color: "white" }]}>Delete account</Text>
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
