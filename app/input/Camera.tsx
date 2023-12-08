import { Camera, CameraType } from "expo-camera";
import React, { useState } from "react";
import { View, Text } from "react-native";
import tw from "tailwind-rn";

import { RoundedButton } from "../RoundedButton";

interface CameraProps {
  onCameraPress: (cameraType: CameraType) => void;
}

export function CameraComponent({
  onCameraPress,
}: CameraProps): React.JSX.Element {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isCameraOpen, setCameraOpen] = useState(false);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <RoundedButton
          icon="camera"
          type="secondary"
          onPress={handleCameraPress}
        />
      </View>
    );
  }

  async function handleCameraPress() {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        // Open the camera
        setCameraOpen(true);
        onCameraPress(type);
        console.log("Camera permission granted");
      } else {
        // Handle case where camera permissions are not granted
        console.log("Camera permission not granted");
      }
    } catch (error) {
      console.error("Error requesting camera permissions:", error);
    }
  }

  return (
    <View style={tw("flex-1")}>
      {isCameraOpen ? (
        <Camera
          style={tw("flex-1")}
          type={type}
          onCameraReady={() => {
            console.log("Camera is ready");
            onCameraPress(type);
          }}
          onMountError={(error) => console.log("Camera mount error", error)}
        />
      ) : (
        <RoundedButton
          icon="camera"
          type="secondary"
          onPress={handleCameraPress}
        />
      )}
    </View>
  );
}
