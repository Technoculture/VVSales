// Footer.tsx
import { CameraType } from "expo-camera";
import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Text } from "react-native";

import { CameraComponent } from "./input/Camera";
import { Gallery } from "./input/Gallery";
import { RoundedButton } from "../components/RoundedButton";

interface FooterProps {
  onCallPress: () => Promise<void>;
  onCameraPress: (cameraType: CameraType) => void;
  onFilePick: (uri: string) => void;
}

export function Footer({
  onCallPress,
  onCameraPress,
  onFilePick,
}: FooterProps): React.JSX.Element {
  const [isCameraModalVisible, setCameraModalVisible] = useState(false);

  const handleCameraPress = () => {
    setCameraModalVisible(true);
  };

  const closeCameraModal = () => {
    setCameraModalVisible(false);
  };

  return (
    <View className="flex flex-row items-center justify-center bg-green-500 px-2 absolute bottom-0 w-full h-44">
      <Gallery onFilePick={onFilePick} />
      <RoundedButton
        icon="call"
        type="primary"
        onPress={async () => await onCallPress()}
      />
      <RoundedButton icon="camera" type="primary" onPress={handleCameraPress} />

      <Modal
        animationType="slide"
        transparent={false}
        visible={isCameraModalVisible}
      >
        <CameraComponent onCameraPress={(type) => onCameraPress(type)} />
        <TouchableOpacity onPress={closeCameraModal}>
          <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>
            Close Camera
          </Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
