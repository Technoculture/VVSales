import React, { useState } from "react";
import { TouchableOpacity, useWindowDimensions, SafeAreaView, Platform, PlatformColor, } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Audio } from "expo-av";
import { getStatusBarHeight } from "react-native-safearea-height";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text } from "../components/Themed";
import OpenAI from "openai";
import { Link } from "expo-router";
import { ChatCard } from './ChatCard';
import { Footer } from './Footer';
import { ExternalLink } from "../components/ExternalLink";
import { isAudioEnabled } from "expo-av/build/Audio/AudioAvailability";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export default function HomeScreen() {
  const { height } = useWindowDimensions();
  const screenHeight = height;
  const safeScreenHeight = height - getStatusBarHeight(true);
  const footerHeight = 160;
  const canvasHeight = safeScreenHeight - footerHeight;
  console.log(`${screenHeight}, ${safeScreenHeight}, ${footerHeight}, ${canvasHeight}`);
  return (
    <SafeAreaView className="flex-1 bg-cyan-50 dark:bg-gray-900" style={{ height: screenHeight }}>
      <View style={{ flex: 1 }}>
      <ChatCard openai={openai} />
      </View>
      <Footer
        onCallPress={async () => await talk()}
        onCameraPress={() => console.log('Camera')}
      />
    </SafeAreaView>
  );
}
