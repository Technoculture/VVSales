import React, { useState } from "react";
import { View, StyleSheet, Text, Button } from 'react-native';
import { Camera, CameraType } from "expo-camera";
import { RoundedButton } from './RoundedButton';

interface FooterProps {
  onCallPress: () => Promise<void>;
  onCameraPress: (cameraType: CameraType) => void;
}

export function Footer({ onCallPress, onCameraPress }: FooterProps): React.JSX.Element {
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
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // Update onCameraPress to handle the camera opening logic
  async function handleCameraPress() {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        // Open the camera
        setCameraOpen(true);
      } else {
        // Handle case where camera permissions are not granted
        console.log('Camera permission not granted');
      }
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
    }
  }

  return (
    <View style={styles.footerContainer}>
      <RoundedButton icon="grid" type="secondary" style={{ marginRight: 2 }} />
      <RoundedButton icon="call" type="primary" style={{ marginHorizontal: 2 }} trigger={onCallPress} />
      {isCameraOpen ? (
        <Camera
          style={{ flex: 1 }}
          type={type}
          onCameraReady={() => console.log('Camera is ready')}
          onMountError={(error) => console.log('Camera mount error', error)}
        />
      ) : (
        <RoundedButton icon="camera" style={{ marginLeft: 2 }} trigger={() => onCameraPress(type)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
