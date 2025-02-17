/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlashList } from "@shopify/flash-list";
import React, { useState } from "react";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { getStatusBarHeight } from "react-native-safearea-height";

import { talk } from "./input/talk";
import { MessageBlob } from "../components/MessageBlob";
import { View } from "../components/Themed";

export function ChatCard() {
  const [msgs, setMsgs] = useState([
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
  ]);

  async function handleTalk() {
    await talk(setMsgs, msgs);
  }

  const { height } = useWindowDimensions();
  const screenHeight = height;
  const safeScreenHeight = height - getStatusBarHeight(true);
  const footerHeight = 160;
  const canvasHeight = safeScreenHeight - footerHeight;

  return (
    <View
      className="relative items-center justify-center bg-cyan-50 dark:bg-gray-900"
      style={{ width: "100%", height: canvasHeight }}
    >
      <View className="absolute h-[90%] w-[90%] mx-2 my-6 dark:bg-gray-950 rounded-xl overflow-hidden">
        <View className="h-12 bg-blue-600 dark:bg-amber-950/80" />
        <FlashList
          renderItem={({ item }) => (
            <MessageBlob {...item} type={item.type as "ai" | "human"} />
          )}
          estimatedItemSize={50}
          data={msgs}
          contentContainerStyle={{ padding: 15 }}
        />
      </View>
    </View>
  );
}
