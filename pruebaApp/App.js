import { AuthProvider } from "./context/AuthContext";
import { LoginScreen } from "./components/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginFunction } from "./components/Login";
import { RegisterFunction } from "./components/Register";
import { Settings } from "./components/screens/settings/Settings";
import { EditProfile } from "./components/screens/settings/EditProfile";
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
import { AccountSettings } from "./components/screens/settings/AccountSettings";
import { ChangeUsername } from "./components/screens/settings/changeUsername";
import { ChangeEmail } from "./components/screens/settings/changeEmail";
import TrainFeedScreen from "./components/screens/TrainFeedScreen";
import { WorkoutSession } from "./components/screens/WorkoutSession";
import ExerciseFeed from "./components/screens/ExerciseFeed";
import WorkoutPost from "./components/screens/WorkoutPost";
import { WorkoutTimeProvider } from "./context/WorkoutTimeContext";
import { WorkoutTrainProvider } from "./context/WorkoutTrainContext";
import SearchUsers from "./components/screens/socialNetwork/SearchUsers";
import FollowRequests from "./components/screens/socialNetwork/FollowRequests";
import Followers from "./components/screens/socialNetwork/Followers";
import Followed from "./components/screens/socialNetwork/Followed";
import VisitProfile from "./components/screens/socialNetwork/VisitProfile";
import ProfileFeedScreen from "./components/home/ProfileFeedScreen";
import VisitFollowers from "./components/screens/socialNetwork/VisitFollowers";
import VisitFollowed from "./components/screens/socialNetwork/VisitFollowed";
import CommentSection from "./components/screens/socialNetwork/CommentPage";
import Likes from "./components/screens/socialNetwork/Likes";
// import branch from "react-native-branch";
import { useEffect } from "react";
import { DetailedSessionScreen } from "./components/screens/DetailedSession";

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { authTokens, loading } = useContext(AuthContext);

  // useEffect(() => {
  //   branch.subscribe(({ error, params }) => {
  //     if (error) {
  //       console.error("Branch error:", error);
  //       return;
  //     }

  //     if (params && params["+clicked_branch_link"]) {
  //       const idEjercicio = params.idEjercicio;
  //       if (idEjercicio) {
  //         // navegar a la pantalla de detalle
  //       }
  //     }
  //   });
  // }, []);
  const linking = {
    prefixes: ["https://atlastracker.app.link", "atlastracker://"],
    config: {
      screens: {
        ExerciseDetail: "exerciseDetail/:idEjercicio",
        Post: "post/:postId", // Ajusta si usas otro nombre de screen
      },
    },
  };

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
                  options={{ headerShown: false }} //No quiero que se muestre Home pero si en sus derivadas
                />
                <Stack.Screen
                  name="ExerciseDetail"
                  component={ExerciseDetail}
                  options={({ route }) => ({
                    title: route.params.nombreEjercicio || "Ejercicio",
                  })}
                />
                <Stack.Screen
                  name="Follow Requests"
                  component={FollowRequests}
                />
                <Stack.Screen
                  name="Followed"
                  component={Followed}
                  options={{ headerTitle: "Following" }}
                />
                <Stack.Screen name="VisitProfile" component={VisitProfile} />
                <Stack.Screen
                  name="VisitFollowers"
                  component={VisitFollowers}
                  options={{ headerTitle: "Followers" }}
                />
                <Stack.Screen
                  name="VisitFollowed"
                  component={VisitFollowed}
                  options={{ headerTitle: "Following" }}
                />
                <Stack.Screen name="Comments" component={CommentSection} />
                <Stack.Screen name="Likes" component={Likes} />
                <Stack.Screen name="Profile" component={ProfileFeedScreen} />
                <Stack.Screen name="Followers" component={Followers} />
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
                <Stack.Screen name="SearchUsers" component={SearchUsers} />
                <Stack.Screen
                  name="WorkoutPost"
                  component={WorkoutPost}
                  options={{ headerTitle: "Finish workout" }}
                />
                <Stack.Screen
                  name="Workout Detail"
                  component={DetailedSessionScreen}
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
