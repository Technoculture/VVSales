import { Camera as ExpoCamera, CameraType } from "expo-camera";
import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity, View, Text, Alert } from "react-native";

interface CameraComponentProps {
  onCameraPress: (cameraType: CameraType) => void;
}

export function CameraComponent({
  onCameraPress,
}: CameraComponentProps): React.ReactElement {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [, setCapturedPhoto] = useState<string | null>(null);
  const cameraRef = useRef<ExpoCamera | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleCameraPress = () => {
    setType((prevType) =>
      prevType === CameraType.back ? CameraType.front : CameraType.back,
    );
    onCameraPress(type);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedPhoto(photo.uri);
        Alert.alert(
          "Photo Captured",
          "The photo has been captured successfully!",
        );
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to capture photo. Please try again.");
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={{ textAlign: "center" }}>
          Camera permission is not granted
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ExpoCamera
        ref={(ref) => (cameraRef.current = ref)}
        style={{ flex: 1 }}
        type={type}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
            padding: 16,
          }}
        >
          <TouchableOpacity
            style={{ backgroundColor: "blue", padding: 16, borderRadius: 9999 }}
            onPress={handleCameraPress}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            style={{ backgroundColor: "red", padding: 16, borderRadius: 9999 }}
            onPress={takePicture}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </ExpoCamera>
    </View>
  );
}
