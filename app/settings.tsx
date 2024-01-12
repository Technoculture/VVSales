import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { TextInput } from "react-native";

import { Text, View } from "../components/Themed";
interface ModalScreenState {
  phoneNumber: string;
  isEditing: boolean;
  user: any;
}

const ModalScreen: React.FC = () => {
  const [state, setState] = useState<ModalScreenState>({
    phoneNumber: "",
    isEditing: true,
    user: null,
  });

  const savePhoneNumber = () => {
    setState((prevState) => ({
      ...prevState,
      user: { phoneNumber: prevState.phoneNumber },
      isEditing: false,
    }));
  };

  const editPhoneNumber = () => {
    setState((prevState) => ({
      ...prevState,
      isEditing: true,
    }));
  };

  console.log("user", state.user);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Settings</Text>
      <View
        className="my-8 border-t border-gray-300 w-4/5"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <TextInput
        className="h-10 border border-blue-300 p-2 mb-4"
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        value={state.phoneNumber}
        onChangeText={(text) =>
          setState((prevState) => ({ ...prevState, phoneNumber: text }))
        }
        editable={state.isEditing}
      />

      {/* Save/Edit button */}
      <Text
        className={`bg-blue-500 text-white p-2 rounded ${
          state.isEditing ? "" : "opacity-50"
        }`}
        onPress={state.isEditing ? savePhoneNumber : editPhoneNumber}
      >
        {state.isEditing ? "Save Phone Number" : "Edit Phone Number"}
      </Text>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style="auto" />
    </View>
  );
};

export default ModalScreen;
export const phoneNumber = ModalScreen.phoneNumber;
