import React, { useState } from 'react';
import { Text, View } from "../components/Themed";
import { FlashList } from '@shopify/flash-list';
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  Platform,
  PlatformColor,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

interface ChatCardProps {
  canvasHeight: number;
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
            <Ionicons name={inAudioMode ? "play-outline" : "chatbubble-outline"} className="flex-1 p-2" />
          </TouchableOpacity>
        ) : null}
      </View>
      {audio != null ? (
        inAudioMode ? <AudioPlayer url={audio} state="paused" /> : <Text className="text-slate-900 dark:text-slate-100">{text}</Text>
      ) : (
        <Text className="text-slate-900 dark:text-slate-100">{text}</Text>
      )}
    </View>
  );
}

export function ChatCard({ canvasHeight }: ChatCardProps) {
  const messages: MessageBlobType[] = [
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

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6EE7B7',
        width: '100%',
        height: canvasHeight,
      }}
    >
      <View
        style={{
          position: 'absolute',
          height: '90%',
          width: '90%',
          margin: 10,
          backgroundColor: '#1E293B',
          borderRadius: 20,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: 12,
            backgroundColor: '#FCD34D',
            opacity: 0.8,
          }}
        />
        <FlashList
          renderItem={({ item }) => <MessageBlob {...item} />}
          estimatedItemSize={50}
          data={messages}
          contentContainerStyle={{ padding: 15 }}
        />
      </View>
    </View>
  );
}
