import { Link, Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-2xl font-bold">This screen doesn't exist.</Text>

        <Link href="/" className="mt-15 py-15">
          <Text className="text-base text-blue-600">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
