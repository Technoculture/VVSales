// CameraScreen.tsx
import React from "react";
import { View } from "react-native";

import { CameraComponent } from "./Camera"; // Import your CameraComponent

export default function CameraScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* Include your CameraComponent with any necessary props */}
      <CameraComponent onCameraPress={() => {}} />
    </View>
  );
}
