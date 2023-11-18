import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, TouchableOpacity } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { Audio } from "expo-av";
import { WaveSurfer } from "wavesurfer-react";

import { Text, View } from "../components/Themed";
import Ionicons from "@expo/vector-icons/Ionicons";

import OpenAI from "openai";
import lancedb from "vectordb";

async function search(vector) {
  console.log(lancedb);
  const db = await lancedb.connect("data/sample-lancedb");

  const table = await db.createTable("vectors", [
    { id: 1, vector: [0.1, 0.2], item: "foo", price: 10 },
    { id: 2, vector: [1.1, 1.2], item: "bar", price: 50 },
  ]);

  const query = table.search(vector).limit(2);
  const results = await query.execute();

  console.log(results);
  return results;
}

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
      className="bg-green-600 h-20 w-20 rounded-full items-center justify-center shadow-inner"
      onPress={trigger}
    >
      <Ionicons name={icon} size={32} color="white" className="shadow-2xl" />
    </TouchableOpacity>
  );
}

interface MessageBlobType {
  type: "human" | "ai";
  text?: string;
  audio?: string;
}

export function MessageBlob(props: MessageBlobType) {
  const { type, text, audio } = props;

  const baseStyle = "py-2 px-4 rounded-full mb-2";
  let variantStyle = " ";
  if (type == "human") {
    variantStyle += "bg-slate-200 mr-auto";
  } else if (type == "ai") {
    variantStyle += "bg-green-300 ml-auto";
  }

  return (
    <View className={`${baseStyle} ${variantStyle}`}>
      {audio != "" ? <WaveSurfer /> : <Text>{text}</Text>}
    </View>
  );
}

let messages: MessageBlobType[] = [
  { type: "human", text: "Hi", audio: "filename.mp3" },
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
      <View className="bg-green-300 flex-1 flex-row items-center justify-center shadow-2xl">
        <RoundedButton
          icon="add-sharp"
          size="small"
          trigger={async () => await search([0.1, 0.3])}
        />
        <RoundedButton
          icon="call"
          size="default"
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
