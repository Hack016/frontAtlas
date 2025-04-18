import { AuthProvider } from "./context/AuthContext";
import { LoginScreen } from "./components/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginFunction } from "./components/Login";
import { RegisterFunction } from "./components/Register";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import { ActivityIndicator } from "react-native-paper";
import { View } from "react-native";
// import { RegisterFunction } from "./components/prueba";

import { Home } from "./components/Home";
import ExerciseDetail from "./components/screens/ExerciseDetail";

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { authTokens, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
        }}
      >
        {authTokens ? (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ExerciseDetail"
              component={ExerciseDetail}
              options={({ route }) => ({
                title: route.params.nombreEjercicio || "Ejercicio",
              })}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="LoginForm" component={LoginFunction} />
            <Stack.Screen name="RegisterForm" component={RegisterFunction} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
