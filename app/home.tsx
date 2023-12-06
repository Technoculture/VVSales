import React, { useState } from "react";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Camera, CameraType } from "expo-camera";
import { Audio } from "expo-av";
import { getStatusBarHeight } from "react-native-safearea-height";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text } from "../components/Themed";
import { SafeAreaView } from "react-native";
import OpenAI from "openai";
import { Link } from "expo-router";
import { ChatCard } from './ChatCard';
import {
  Platform,
  PlatformColor,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { ExternalLink } from "../components/ExternalLink";
import { isAudioEnabled } from "expo-av/build/Audio/AudioAvailability";
import { useNavigation } from '@react-navigation/native';

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

interface RoundedButtonProps {
  trigger: () => void;
  icon: string;
  className?: string;
}

export function RoundedButton({
  trigger,
  icon,
  className,
}: RoundedButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity
      className={`bg-green-600 dark:bg-green-950 h-20 w-20 rounded-full items-center justify-center ${className}`}
      onPress={trigger}
    >
      <Ionicons name={icon} size={32} color={"white"} className="" />
    </TouchableOpacity>
  );
}

interface MessageBlobType {
  type: "human" | "ai";
  text?: string;
  audio?: string;
}

interface AudioPlayerProps {
  url: string;
  state: "playing" | "paused";
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
          return (
            <View
              className="w-1 bg-green-500 rounded-full"
              key={index}
              height={randomNumber}
            />
          );
        })}
      </View>
    </View>
  );
}

export function MessageBlob(props: MessageBlobType) {
  const { type, text, audio } = props;

  const [inAudioMode, setInAudioMode] = useState(true);

  const baseStyle = "py-3 px-4 rounded-2xl mb-2 gap-1";
  let variantStyle = " ";
  if (type == "human") {
    variantStyle += "bg-green-300 dark:bg-green-700 ml-auto";
  } else if (type == "ai") {
    variantStyle += "bg-slate-100 dark:bg-amber-800 mr-auto";
  }

  return (
    <View className={`${baseStyle} ${variantStyle}`}>
      <View className="flex-row flex-1 bg-transparent items-center">
        <Text className="text-slate-700 dark:text-green-200 flex-grow">
          {type === "ai" ? "Ella" : "Satyam"}
        </Text>
        { audio != null ? (
        <TouchableOpacity onPress={() => setInAudioMode(!inAudioMode)}>
          <Ionicons name={ inAudioMode ? "play-outline" : "chatbubble-outline"  } className="flex-1 p-2" />
        </TouchableOpacity>
        ) : null}
      </View>
      {audio != null ? (
        inAudioMode ?
        <AudioPlayer url={audio} state="paused" /> : <Text className="text-slate-900 dark:text-slate-100">{text}</Text>
      ) : (
        <Text className="text-slate-900 dark:text-slate-100">{text}</Text>
      )}
    </View>
  );
}


export default function HomeScreen() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [sound, setSound] = useState();


  async function talk() {
    setMsgs([...msgs, { type: "ai", text: "..." }]);
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "Nice to Meet you" }],
        model: "gpt-3.5-turbo",
      });
      console.log(chatCompletion);
      const response: MessageBlobType = {
        type: "ai",
        text: chatCompletion.choices[0].message.content || "",
      };
      setMsgs([...msgs, response]);
      return chatCompletion;
    } catch (err) {
      console.error(err);
    }
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    );
  }

  const {height} = useWindowDimensions();
  const screenHeight = height;
  const safeScreenHeight = height - getStatusBarHeight(true);
  const footerHeight = 160;
  const canvasHeight = safeScreenHeight - footerHeight;
  console.log(`${screenHeight}, ${safeScreenHeight}, ${footerHeight}, ${canvasHeight}`);

  return (
    <SafeAreaView className="flex-1 bg-cyan-50 dark:bg-gray-900" style={{ height: screenHeight }}>
      <ChatCard openai={openai} />
      <View
        className="flex-row items-center justify-center bg-green-300 dark:bg-gray-950 p-2 mb-2"
        style={{ height: footerHeight }}
      >
        <RoundedButton icon="grid" type="secondary" className="mr-2" />
        <RoundedButton
          icon="call"
          type="primary"
          className="mx-2"
          trigger={async () => await talk()}
        />
        <RoundedButton
          icon="camera"
          className="ml-2"
          trigger={() => console.log("Camera")}
        />
      </View>
    </SafeAreaView>
  );
}
