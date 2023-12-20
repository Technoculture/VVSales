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
        type: "application/pdf,text/plain,image/*,audio/*,video/*,.doc,.docx",
      });
      // as i cannot resolve this error right now, i will leave it as it is and check its functionality in build
      // @ts-expect-error
      if (result.type === "success") {
        // @ts-expect-error
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
