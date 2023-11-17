import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

import { Text, View } from "../components/Themed";

export default function ModalScreen() {
  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold">Ella</Text>
        <View className="w-[80%] h-[70%] bg-red-100 rounded-xl" />
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
      <View className="h-40 bg-slate-100" />
    </View>
  );
}
