import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import { View } from "./Themed";

interface AudioPlayerProps {
  url: string;
  state: "playing" | "stopped";
}

export function AudioPlayer({ url, state }: AudioPlayerProps) {
  const [isPlaying, setPlaying] = useState(state === "playing");

  return (
    <View className="flex-2 bg-transparent gap-2">
      <View className="flex-2 flex-row gap-[1px] bg-transparent justify-center items-center">
        <TouchableOpacity
          onPress={() => {
            setPlaying(!isPlaying);
          }}
        >
          <Ionicons name={isPlaying ? "pause" : "play"} size={32} />
        </TouchableOpacity>
        {Array.from({ length: 20 }, (_, index) => {
          const randomNumber = Math.floor(Math.random() * 10) * 2;
          const styles = {
            height: randomNumber,
          };
          return (
            <View
              className="w-1 bg-green-500 rounded-full"
              key={index}
              style={styles}
            />
          );
        })}
      </View>
    </View>
  );
}
