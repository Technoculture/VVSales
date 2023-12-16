import { Camera as ExpoCamera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Link } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity, View, Text, Alert, PixelRatio } from "react-native";
import { captureRef } from "react-native-view-shot";
interface CameraComponentProps {
  onCameraPress: (cameraType: CameraType) => void;
}

export function CameraComponent({
  onCameraPress,
}: CameraComponentProps): React.ReactElement {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
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
        const targetPixelCount = 1080;
        const pixelRatio = PixelRatio.get();
        const pixels = targetPixelCount / pixelRatio;

        const result = await captureRef(cameraRef.current, {
          result: "tmpfile",
          height: pixels,
          width: pixels,
          quality: 1,
          format: "png",
        });

        await MediaLibrary.saveToLibraryAsync(result.uri);
        Alert.alert(
          "Photo Captured",
          "The photo has been captured successfully!",
          [
            {
              text: "OK",
              // onPress={() => router.replace("/")},
            },
          ],
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
      <Link
        href="../index.tsx"
        style={{ position: "absolute", top: 16, left: 16, zIndex: 2 }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>{`< Back`}</Text>
      </Link>

      <ExpoCamera
        ref={(ref) => (cameraRef.current = ref)}
        style={{ flex: 1 }}
        type={type}
      >
        {/* Bottom buttons */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: 16,
          }}
        >
          <TouchableOpacity
            style={{ backgroundColor: "blue", padding: 16, borderRadius: 9999 }}
            onPress={handleCameraPress}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Flip Camera</Text>
          </TouchableOpacity>
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
