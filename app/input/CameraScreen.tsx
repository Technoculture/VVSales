// CameraScreen.tsx
import React from "react";
import { View } from "react-native";

import { CameraComponent } from "./Camera";

export default function CameraScreen() {
  return (
    <View className="flex-1">
      <CameraComponent onCameraPress={() => {}} />
    </View>
  );
}
