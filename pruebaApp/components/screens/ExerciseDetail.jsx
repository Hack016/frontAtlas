import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import History from "./History";
import HowTo from "./Howto";
import Summary from "./Summary";
import { useRoute } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

const ExerciseDetail = () => {
  const { params } = useRoute();

  return (
    <Tab.Navigator screenOptions={{ swipeEnabled: false }}>
      <Tab.Screen
        name="History"
        component={History}
        initialParams={{ idEjercicio: params?.idEjercicio }}
      />
      <Tab.Screen
        name="How to"
        component={HowTo}
        initialParams={{ idEjercicio: params?.idEjercicio }}
      />
      <Tab.Screen
        name="Summary"
        component={Summary}
        initialParams={{ idEjercicio: params?.idEjercicio }}
      />
    </Tab.Navigator>
  );
};

export default ExerciseDetail;
