import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import { AudioPlayer } from "./AudioPlayer";
import { Text, View } from "../components/Themed";

interface MessageBlobProps {
  type: "human" | "ai";
  text?: string;
  audio?: string;
}

export function MessageBlob(props: MessageBlobProps): React.ReactElement {
  const { type, text, audio } = props;
  const [inAudioMode, setInAudioMode] = useState(true);

  const baseStyle = "py-3 px-4 rounded-2xl mb-2 gap-1";
  let variantStyle = " ";

  if (type === "human") {
    variantStyle += "bg-green-300 dark:bg-green-700 ml-auto";
  } else if (type === "ai") {
    variantStyle += "bg-slate-100 dark:bg-amber-800 mr-auto";
  }

  return (
    <View className={`${baseStyle} ${variantStyle}`}>
      <View className="flex-row flex-1 bg-transparent items-center">
        <Text className="text-slate-700 dark:text-green-200 flex-grow">
          {type === "ai" ? "Ella" : "Satyam"}
        </Text>
        {audio != null ? (
          <TouchableOpacity onPress={() => setInAudioMode(!inAudioMode)}>
            <Ionicons
              name={inAudioMode ? "play-outline" : "chatbubble-outline"}
              className="flex-1 p-2"
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {audio != null ? (
        inAudioMode ? (
          <AudioPlayer url={audio} state="paused" />
        ) : (
          <Text className="text-slate-900 dark:text-slate-100">{text}</Text>
        )
      ) : (
        <Text className="text-slate-900 dark:text-slate-100">{text}</Text>
      )}
    </View>
  );
}
