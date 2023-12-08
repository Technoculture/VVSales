import { CameraType } from "expo-camera";
import React from "react";
import { View, StyleSheet } from "react-native";

import { RoundedButton } from "./RoundedButton";
import { CameraComponent } from "./input/Camera";
import { Gallery } from "./input/Gallery";

interface FooterProps {
  onCallPress: () => Promise<void>;
  onCameraPress: (cameraType: CameraType) => void;
}

export function Footer({
  onCallPress,
  onCameraPress,
}: FooterProps): React.JSX.Element {
  function handleFilePick(uri: string) {
    console.log("Picked file:", uri);
  }

  return (
    <View style={styles.footerContainer}>
      <Gallery onFilePick={handleFilePick} />
      <RoundedButton icon="call" type="primary" onPress={onCallPress} />
      <RoundedButton
        icon="camera"
        type="secondary"
        onPress={() => onCameraPress(CameraType.back)}
      />
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
