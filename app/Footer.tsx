import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RoundedButton } from './RoundedButton';
import { CameraComponent } from './input/Camera';
import { Gallery } from './input/Gallery';
import { CameraType } from 'expo-camera';

interface FooterProps {
  onCallPress: () => Promise<void>;
  onCameraPress: (cameraType: CameraType) => void;
}

export function Footer({ onCallPress, onCameraPress }: FooterProps): React.JSX.Element {
  // Function to handle file picked from the gallery
  function handleFilePick(uri: string) {
    console.log('Picked file:', uri);
    // You can perform further actions with the selected file URI
  }

  return (
    <View style={styles.footerContainer}>
      <Gallery onFilePick={handleFilePick} />
      <RoundedButton icon="call" type="primary" onPress={onCallPress} />
      <RoundedButton icon="camera" type="secondary" onPress={() => onCameraPress(CameraType.back)} />
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    padding: 2,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 160,
  },
});
