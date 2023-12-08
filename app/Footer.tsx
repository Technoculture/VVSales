// Footer.tsx
import { CameraType } from "expo-camera";
import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Text } from "react-native";

import { CameraComponent } from "./Camera";
import { RoundedButton } from "./RoundedButton";
import { Gallery } from "./input/Gallery";

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
    <View style={styles.footerContainer}>
      <Gallery onFilePick={onFilePick} />
      <RoundedButton icon="call" type="primary" onPress={onCallPress} />
      <RoundedButton
        icon="camera"
        type="secondary"
        trigger={handleCameraPress}
      />

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

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    padding: 2,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 160,
  },
});
