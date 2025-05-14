import { AuthProvider } from "./context/AuthContext";
import { LoginScreen } from "./components/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginFunction } from "./components/Login";
import { RegisterFunction } from "./components/Register";
import { Settings } from "./components/screens/Settings";
import { EditProfile } from "./components/screens/EditProfile";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import {
  Provider as PaperProvider,
  ActivityIndicator,
} from "react-native-paper";

import { View } from "react-native";
import { StatusBar } from "react-native";
import { Home } from "./components/Home";
import ExerciseDetail from "./components/screens/ExerciseDetail";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { OptionalInfo } from "./components/optionalInfo";
import { AccountSettings } from "./components/screens/AccountSettings";
import { ChangeUsername } from "./components/screens/changeUsername";
import { ChangeEmail } from "./components/screens/changeEmail";
import TrainFeedScreen from "./components/screens/TrainFeedScreen";
import { WorkoutSession } from "./components/screens/WorkoutSession";
import ExerciseFeed from "./components/screens/ExerciseFeed";
import WorkoutPost from "./components/screens/WorkoutPost";
import { WorkoutTimeProvider } from "./context/WorkoutTimeContext";
import { WorkoutTrainProvider } from "./context/WorkoutTrainContext";

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
    <ActionSheetProvider>
      <PaperProvider>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
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
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen
                  name="Account Settings"
                  component={AccountSettings}
                />
                <Stack.Screen
                  name="Change Username"
                  component={ChangeUsername}
                />
                <Stack.Screen name="Change Email" component={ChangeEmail} />
                <Stack.Screen name="Exercises" component={TrainFeedScreen} />
                <Stack.Screen
                  name="Workout Session"
                  component={WorkoutSession}
                />
                <Stack.Screen name="Exercise Feed" component={ExerciseFeed} />
                <Stack.Screen
                  name="WorkoutPost"
                  component={WorkoutPost}
                  options={{ headerTitle: "Finish workout" }}
                />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="LoginForm" component={LoginFunction} />
                <Stack.Screen
                  name="RegisterForm"
                  component={RegisterFunction}
                />
                <Stack.Screen
                  name="OptionalInfo"
                  component={OptionalInfo}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ActionSheetProvider>
  );
};
export default function App() {
  return (
    <WorkoutTimeProvider>
      <WorkoutTrainProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </WorkoutTrainProvider>
    </WorkoutTimeProvider>
  );
}
