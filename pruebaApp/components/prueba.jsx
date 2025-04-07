import { ScrollView, Image, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export const RegisterFunction = ({ navigation }) => {
  const [text, onChangeText] = React.useState("");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/TitanVectorizado.png")}
        ></Image>
        <TextInput
          label="Correo electrónico"
          value={text}
          onChangeText={(text) => onChangeText(text)}
          mode="outlined"
          style={styles.input}
          outlineColor="blue"
          activeOutlineColor="blue"
          activeUnderlineColor="blue"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2,
    marginBottom: 10,
  },
  input: {
    color: "blue",
    height: 40,
    width: "80%",
    margin: 12,
    padding: 10,
    backgroundColor: "transparent",
  },
});
