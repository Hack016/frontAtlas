import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { BASE_URL } from "../../../context/config";
import { useFetchWithAuth } from "../../../utils/fetchWithAuth";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

export const ChangeUsername = () => {
  const navigation = useNavigation();
  const fetchWithAuth = useFetchWithAuth();
  const route = useRoute();
  const { username } = route.params;
  const [newusername, setnewusername] = useState(username);
  const [isAvailable, setIsAvailable] = useState(null);
  const [isInvalid, setIsInvalid] = useState(null);
  const [loading, setLoading] = useState(false);

  const hasChanged = username !== newusername;

  const isValidUsernameFormat = (username) =>
    /^[a-zA-Z0-9_]{4,15}$/.test(username); //test para el formato de username (minimo 4 caracteres y maximo 15)

  const checkUsernameAvailability = async (username) => {
    const response = await fetchWithAuth(
      `${BASE_URL}api/check-username/?username=${encodeURIComponent(username)}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    return data.available;
  };
  const updateUsername = async (username) => {
    try {
      const response = await fetchWithAuth(`${BASE_URL}api/check-username/`, {
        method: "POST",
        body: JSON.stringify({ username }),
      });
      if (response.ok) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        const errorData = await response.json();
        console.log("Username update error details:", errorData);

        Alert.alert("Error", errorData.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Update username failed", error);
      Alert.alert("Error", "Network error.");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        hasChanged &&
        newusername.trim().length > 0 &&
        isValidUsernameFormat(newusername)
      ) {
        setLoading(true);
        setIsAvailable(null);
        setIsInvalid(null);
        checkUsernameAvailability(newusername).then((available) => {
          setIsAvailable(available);
          setLoading(false);
        });
      } else {
        if (!isValidUsernameFormat(newusername)) {
          setIsInvalid(true);
          setIsAvailable(null);
        } else {
          setIsAvailable(null);
        }
      }
    }, 1000); // Esperar 1000ms

    return () => clearTimeout(timeout);
  }, [newusername]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Username</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={newusername}
            onChangeText={setnewusername}
            mode="flat"
            style={styles.input}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            placeholder={username}
          />
          {loading ? (
            <ActivityIndicator size="small" style={styles.icon} />
          ) : isAvailable === true && isInvalid !== true ? (
            <MaterialIcons
              name="check-circle"
              size={24}
              color="green"
              style={styles.icon}
            />
          ) : isAvailable === false || isInvalid === true ? (
            <MaterialIcons
              name="cancel"
              size={24}
              color="red"
              style={styles.icon}
            />
          ) : null}
        </View>

        {isAvailable === false && (
          <Text style={styles.errorText}>
            This username already exists. Try another.
          </Text>
        )}
        {isInvalid === true && (
          <Text style={styles.errorText}>
            Invalid username format. Try another.
          </Text>
        )}

        <Pressable
          style={[
            styles.updateButton,
            {
              backgroundColor:
                hasChanged && isAvailable === true ? "#007BFF" : "#7a7a7a",
            },
          ]}
          disabled={
            !hasChanged || !isValidUsernameFormat(newusername) || !isAvailable
          }
          onPress={() => updateUsername(newusername)}
        >
          <Text style={styles.updateText}>Update</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  label: {
    fontSize: 18,
    alignSelf: "flex-start",
    marginBottom: 8,
    color: "black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
  },
  icon: {
    marginHorizontal: 10,
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  updateButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  updateText: {
    color: "white",
    fontWeight: "bold",
  },
});
