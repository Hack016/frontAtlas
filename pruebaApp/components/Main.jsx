import { Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native-web";

export function Main() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Pressable
        onPress={() => console.log("Pressed!")}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#ddd" : "#0f0",
            opacity: pressed ? 0.5 : 1,
          },
        ]}
      >
        <Text>Press Me</Text>
      </Pressable>
      <Text style={{ fontSize: 20 }}>NO ENTIENDO NADA</Text>
    </View>
  );
}
