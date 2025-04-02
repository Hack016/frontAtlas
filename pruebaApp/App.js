// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, View } from "react-native";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { LoginScreen } from "./components/LoginScreen";
import { LoginScreen } from "./components/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginFunction } from "./components/Login";
import { Home } from "./components/Home";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="LoginForm" component={LoginFunction} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
      {/* <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <LoginScreen />
        </View>
      </SafeAreaProvider> */}
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
