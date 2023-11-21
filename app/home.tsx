import { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, PlatformColor, TouchableOpacity } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { Audio } from "expo-av";
import { FlashList } from "@shopify/flash-list";

import { Text, View } from "../components/Themed";
import { ExternalLink } from "../components/ExternalLink";
import Ionicons from "@expo/vector-icons/Ionicons";

import OpenAI from "openai";
import { Link } from "expo-router";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

interface RoundedButtonProps {
  trigger: () => void;
  icon: string;
}

export function RoundedButton({ trigger, icon }: RoundedButtonProps) {
  return (
    <TouchableOpacity
      className="bg-green-600 dark:bg-green-700 h-20 w-20 rounded-full items-center justify-center shadow-inner"
      onPress={trigger}
    >
      <Ionicons name={icon} size={32} color={"white"} className="shadow-2xl" />
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
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={32}
          />
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
      {/*
      <ExternalLink className="flex" href={url}>
        <Ionicons name="download-outline" size={20} />
      </ExternalLink>
      */}
    </View>
  );
}

export function MessageBlob(props: MessageBlobType) {
  const { type, text, audio } = props;

  const baseStyle = "py-3 px-4 rounded-2xl mb-2";
  let variantStyle = " ";
  if (type == "human") {
    variantStyle += "bg-green-300 dark:bg-green-900 ml-auto";
  } else if (type == "ai") {
    variantStyle += "bg-slate-100 dark:bg-neutral-900 mr-auto";
  }

  return (
    <View className={`${baseStyle} ${variantStyle}`}>
      <Text className="text-slate-100 dark:text-green-100">{type === "ai" ? "Ella" : "Satyam"}</Text>
      {audio != null ? (
        <AudioPlayer url={audio} state="paused" />
      ) : (
        <Text className="text-slate-100 dark:text-slate-100">{text}</Text>
      )}
    </View>
  );
}

let messages: MessageBlobType[] = [
  {
    type: "human",
    text: "Hi",
    audio: "https://d7ftvotrexusa.cloudfront.net/chataudio/1340/G4mv3Y9.mpeg",
  },
  { type: "ai", text: "Hi Human!" },
  {
    type: "human",
    text: "Hi",
    audio: "https://d7ftvotrexusa.cloudfront.net/chataudio/1340/G4mv3Y9.mpeg",
  },
  { type: "ai", text: "Hi Human!" },
  {
    type: "human",
    text: "Hi",
    audio: "https://d7ftvotrexusa.cloudfront.net/chataudio/1340/G4mv3Y9.mpeg",
  },
  { type: "ai", text: "Hi Human!" },
  { type: "human", text: "Nice to meet you" },
  { type: "ai", text: "Hi Human!" },
  {
    type: "human",
    text: "Hi",
    audio: "https://d7ftvotrexusa.cloudfront.net/chataudio/1340/G4mv3Y9.mpeg",
  },
  { type: "ai", text: "Hi Human!" },
  { type: "human", text: "Nice to meet you" },
  { type: "ai", text: "Hi Human!" },
  {
    type: "human",
    text: "Hi",
    audio: "https://d7ftvotrexusa.cloudfront.net/chataudio/1340/G4mv3Y9.mpeg",
  },
  { type: "ai", text: "Hi Human!" },
  { type: "human", text: "Nice to meet you" },
];

export default function HomeScreen() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [sound, setSound] = useState();

  const [msgs, setMsgs] = useState(messages);

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

  return (
    <View className="flex-1">
      <View className="flex-3 items-center justify-center gap-6 bg-cyan-50 dark:bg-stone-900">
        <View className="flex-row gap-2 bg-transparent">
          <Text className="text-2xl font-bold text-stone-100 dark:text-stone-300">Ella</Text>
        </View>
        <View className="w-[80%] h-[70%] rounded-xl overflow-hidden bg-yellow-100 dark:bg-zinc-950">
          <View className="h-12 w-full bg-yellow-900 dark:bg-amber-950 shadow-xl" />
          <FlashList
            renderItem={({ item }: { item: MessageBlobType }) => <MessageBlob {...item} />}
            estimatedItemSize={msgs.length}
            data={msgs}
          />
          <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
      </View>
      <View className="bg-green-300 dark:bg-stone-950 flex-1 flex-row items-center justify-center shadow-2xl">
        <RoundedButton icon="grid" type="secondary" />
        <RoundedButton
          icon="call"
          type="primary"
          trigger={async () => await talk()}
        />
        <RoundedButton
          icon="camera"
          size="small"
          trigger={() => console.log("Camera")}
        />
      </View>
    </View>
  );
}
