import { StatusBar } from "expo-status-bar";
import { Platform, TouchableOpacity } from "react-native";

import { Text, View } from "../components/Themed";
import Ionicons from "@expo/vector-icons/Ionicons";

import OpenAI from "openai";
import { useState } from "react";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

interface CallButtonProps {
  trigger: () => {};
}

export function CallButton(props: CallButtonProps) {
  const { trigger } = props;

  return (
    <TouchableOpacity
      className="bg-green-600 h-20 w-20 rounded-full items-center justify-center shadow-inner"
      onPress={trigger}
    >
      <Ionicons name="call" size={32} color="white" className="shadow-2xl" />
    </TouchableOpacity>
  );
}

interface MessageBlobType {
  type: "human" | "ai";
  text?: string;
}

export function MessageBlob(props: MessageBlobType) {
  const { type, text } = props;

  const baseStyle = "py-2 px-4 rounded-full mb-2";
  let variantStyle = " ";
  if (type == "human") {
    variantStyle += "bg-slate-200 mr-auto";
  } else if (type == "ai") {
    variantStyle += "bg-green-300 ml-auto";
  }

  return (
    <View className={`${baseStyle} ${variantStyle}`}>
      <Text>{text}</Text>
    </View>
  );
}

let messages: MessageBlobType[] = [
  { type: "human", text: "Hi" },
  { type: "ai", text: "Hi Human!" },
  { type: "human", text: "Nice to meet you" },
];

export default function HomeScreen() {
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

  return (
    <View className="flex-1">
      <View className="flex-3 items-center justify-center gap-6 bg-green-100">
        <View className="flex-row gap-2 bg-green-100">
          <Text className="text-2xl font-bold">Ella</Text>
        </View>
        <View className="w-[80%] h-[70%] bg-white/50 rounded-xl shadow-xl p-4">
          {msgs.map((blob, index) => (
            <MessageBlob type={blob.type} text={blob.text} key={index} />
          ))}
        </View>
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
      <View className="bg-green-300 flex-1 flex-row gap-2 items-center justify-center shadow-2xl">
        <CallButton trigger={async () => await talk()} />
      </View>
    </View>
  );
}
