/* eslint-disable @typescript-eslint/no-unused-vars */
import OpenAI from "openai";
import React, { useState } from "react";
import { useWindowDimensions, SafeAreaView } from "react-native";

import { ChatCard } from "./ChatCard";
import { Footer } from "./Footer";
import { talk } from "./input/talk";
import { View } from "../components/Themed";

export default function HomeScreen() {
  const { height } = useWindowDimensions();
  const screenHeight = height;
  const [msgs, setMsgs] = useState<any[]>([]);

  return (
    <SafeAreaView
      className="flex-1 bg-cyan-50 dark:bg-gray-900"
      style={{ height: screenHeight }}
    >
      <View style={{ flex: 1 }}>
        <ChatCard />
      </View>
      <Footer
        onCallPress={async () => await talk(setMsgs, msgs)}
        onCameraPress={() => console.log("Camera")}
        onFilePick={function (uri: string): void {
          throw new Error("Function not implemented.");
        }}
      />
    </SafeAreaView>
  );
}
