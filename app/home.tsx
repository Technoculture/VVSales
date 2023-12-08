import OpenAI from "openai";
import React from "react";
import { useWindowDimensions, SafeAreaView } from "react-native";
import { getStatusBarHeight } from "react-native-safearea-height";

import { ChatCard } from "./ChatCard";
import { Footer } from "./Footer";
import { View } from "../components/Themed";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export default function HomeScreen() {
  const { height } = useWindowDimensions();
  const screenHeight = height;
  const safeScreenHeight = height - getStatusBarHeight(true);
  const footerHeight = 160;
  const canvasHeight = safeScreenHeight - footerHeight;

  return (
    <SafeAreaView
      className="flex-1 bg-cyan-50 dark:bg-gray-900"
      style={{ height: screenHeight }}
    >
      <View style={{ flex: 1 }}>
        <ChatCard openai={openai} />
      </View>
      <Footer
        onCallPress={async () => await talk()}
        onCameraPress={() => console.log("Camera")}
      />
    </SafeAreaView>
  );
}
