import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { View } from "react-native";

import { RoundedButton } from "../../components/RoundedButton";

interface GalleryProps {
  onFilePick: (uri: string) => void;
}

export function Gallery({ onFilePick }: GalleryProps): React.JSX.Element {
  async function openDocumentPicker() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result.type === "success") {
        onFilePick(result.uri);
      }
    } catch (error) {
      console.error("Error picking a file:", error);
    }
  }

  return (
    <View className="flex-row items-center justify-center">
      <RoundedButton icon="grid" type="primary" onPress={openDocumentPicker} />
    </View>
  );
}
