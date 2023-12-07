import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { RoundedButton } from '../RoundedButton';

interface GalleryProps {
  onFilePick: (uri: string) => void;
}

export function Gallery({ onFilePick }: GalleryProps): React.JSX.Element {
  // Function to open document picker
  async function openDocumentPicker() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (result.type === 'success') {
        console.log(result.uri);
        onFilePick(result.uri);
      }
    } catch (error) {
      console.error('Error picking a file:', error);
    }
  }

  return (
    <View style={styles.galleryContainer}>
      <RoundedButton icon="grid" type="secondary" onPress={openDocumentPicker} />
    </View>
  );
}

const styles = StyleSheet.create({
  galleryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
