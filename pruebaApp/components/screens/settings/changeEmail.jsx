import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { BASE_URL } from "../../../context/config";
import { useFetchWithAuth } from "../../../utils/fetchWithAuth";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export const ChangeEmail = () => {
  const navigation = useNavigation();
  const fetchWithAuth = useFetchWithAuth();
  const route = useRoute();
  const { email } = route.params;
  const [newemail, setnewmail] = useState(email);
  const [isAvailable, setIsAvailable] = useState(null);
  const [isInvalid, setIsInvalid] = useState(null);
  const [loading, setLoading] = useState(false);

  const hasChanged = email !== newemail;

  const isValidEmailFormat = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const checkEmailAvailability = async (email) => {
    const response = await fetchWithAuth(
      `${BASE_URL}api/check-email/?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    return data.available;
  };
  const updateEmail = async (email) => {
    try {
      const response = await fetchWithAuth(`${BASE_URL}api/check-email/`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        const errorData = await response.json();
        console.log("Email update error details:", errorData);

        Alert.alert("Error", errorData.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Update email failed", error);
      Alert.alert("Error", "Network error.");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        hasChanged &&
        newemail.trim().length > 0 &&
        isValidEmailFormat(newemail)
      ) {
        setLoading(true);
        setIsAvailable(null);
        setIsInvalid(null);
        checkEmailAvailability(newemail).then((available) => {
          setIsAvailable(available);
          setLoading(false);
        });
      } else {
        if (!isValidEmailFormat(newemail)) {
          setIsInvalid(true);
          setIsAvailable(null);
        } else {
          setIsAvailable(null);
        }
      }
    }, 1000); // Esperar 1000ms

    return () => clearTimeout(timeout);
  }, [newemail]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Email </Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={newemail}
            onChangeText={setnewmail}
            mode="flat"
            style={styles.input}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            placeholder={email}
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
            Incorrect email format. Try another.
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
            !hasChanged || !isValidEmailFormat(newemail) || !isAvailable
          }
          onPress={() => updateEmail(newemail)}
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
    color: "black",
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
