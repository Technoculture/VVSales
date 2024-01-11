import { StatusBar } from "expo-status-bar";
import React from "react";
import { TextInput } from "react-native";

import { Text, View } from "../components/Themed";

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Setting</Text>
      <View
        className="my-8 border-t border-gray-300 w-4/5"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      {/* Input field for the phone number */}
      <TextInput
        className="h-10 border border-blue-300 p-2 mb-4"
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        // onChangeText={(text) => setPhoneNumber(text)} // assuming you have state for phone number
      />
      <Text
        className="bg-blue-500 text-white p-2 rounded"
        // onPress={savePhoneNumber} // assuming you have a function to save phone number
      >
        Save Phone Number
      </Text>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style="auto" />
    </View>
  );
}
