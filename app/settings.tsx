import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { TextInput } from "react-native";

import { Text, View } from "../components/Themed";

export default function ModalScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [user, setUser] = useState(null);

  const savePhoneNumber = () => {
    setUser({phoneNumber,});
    setIsEditing(false);
  };
  const editPhoneNumber = () => {
    setIsEditing(true);
  };

  console.log("user", user);
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Settings</Text>
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
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        editable={isEditing}
      />

      {/* Save/Edit button */}
      <Text
        className={`bg-blue-500 text-white p-2 rounded ${
          isEditing ? "" : "opacity-50"
        }`}
        onPress={isEditing ? savePhoneNumber : editPhoneNumber}
      >
        {isEditing ? "Save Phone Number" : "Edit Phone Number"}
      </Text>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style="auto" />
    </View>
  );
}
