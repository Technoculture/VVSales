import Ionicons from "@expo/vector-icons/Ionicons";
import { cva, type VariantProps } from "class-variance-authority";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { AudioPlayer } from "./AudioPlayer";
import { Text } from "../components/Themed";

interface MessageBlobProps extends VariantProps<typeof messageBlob> {
  text?: string;
  audio?: string;
}

const baseStyle = "py-3 px-4 rounded-2xl mb-2 gap-1";

const messageBlob = cva(baseStyle, {
  variants: {
    type: {
      human: "bg-green-300 dark:bg-green-700 ml-auto",
      ai: "bg-slate-100 dark:bg-amber-800 mr-auto",
    },
  },
  defaultVariants: {
    type: "human",
  },
});

export function MessageBlob(props: MessageBlobProps): React.ReactElement {
  const { type, text, audio, className } = props;
  const [inAudioMode, setInAudioMode] = useState(true);

  return (
    <View className={messageBlob({ type, className })}>
      <View className="flex-row flex-1 bg-transparent items-center">
        <Text className="text-slate-700 dark:text-green-200 flex-grow">
          {type === "ai" ? "Ella" : "Satyam"}
        </Text>
        {audio != null && (
          <TouchableOpacity onPress={() => setInAudioMode(!inAudioMode)}>
            <Ionicons
              name={inAudioMode ? "play-outline" : "chatbubble-outline"}
              className="flex-1 p-2"
            />
          </TouchableOpacity>
        )}
      </View>
      {audio != null ? (
        inAudioMode ? (
          <AudioPlayer url={audio} state="stopped" />
        ) : (
          <Text className="text-slate-900 dark:text-slate-100">{text}</Text>
        )
      ) : (
        <Text className="text-slate-900 dark:text-slate-100">{text}</Text>
      )}
    </View>
  );
}
