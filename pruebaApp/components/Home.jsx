// import { Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeFeedScreen from "./home/HomeFeedScreen";
import ProfileFeedScreen from "./home/ProfileFeedScreen";
import TrainFeedScreen from "./home/TrainFeedScreen";
import { MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Train") {
            return <FontAwesome6 name="dumbbell" size={size} color={color} />;
          } else {
            let iconName;
            if (route.name === "HomeFeed") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "account" : "account-outline";
            }

            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          }
        },
        tabBarActiveTintColor: "#007BFF",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { fontSize: 12 },
      })}
    >
      <Tab.Screen
        name="HomeFeed"
        component={HomeFeedScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen name="Train" component={TrainFeedScreen} />
      <Tab.Screen name="Profile" component={ProfileFeedScreen} />
    </Tab.Navigator>
  );
}
