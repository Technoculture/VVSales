// audioPlayer.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from "expo-av";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import { View } from "./Themed";

interface AudioPlayerProps {
  url: string;
}

export function AudioPlayer({ url }: AudioPlayerProps): React.JSX.Element {
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);

  async function handlePlayPause() {
    if (!sound) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true },
      );
      setSound(sound);
    } else {
      const status = await sound.getStatusAsync();
      if (status.isPlaying) {
        sound.pauseAsync();
      } else {
        sound.playAsync();
      }
    }
  }

  return (
    <View className="flex-2 bg-transparent gap-2">
      <View className="flex-2 flex-row gap-[1px] bg-transparent justify-center items-center">
        <TouchableOpacity onPress={handlePlayPause}>
          <Ionicons name="play" size={32} />
        </TouchableOpacity>
        {/* Other UI elements */}
      </View>
    </View>
  );
}
