import React, { useState } from "react";
import { Text, View, TouchableOpacity, ViewProps } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";

// Interface for the CustomViewProps
interface CustomViewProps extends ViewProps {
  customHeight: number;
}

// CustomView component
const CustomView: React.FC<CustomViewProps> = ({ customHeight, ...rest }) => {
  return <View style={{ height: customHeight, ...(rest.style as object) }} {...rest} />;
};

// Interface for the MessageBlobType
interface MessageBlobType {
  type: "human" | "ai";
  text?: string;
  audio?: string;
}

// Interface for the AudioPlayerProps
interface AudioPlayerProps {
  url: string;
  state: "playing" | "paused";
}

// AudioPlayer component
const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, state }) => {
  const [isPlaying, setPlaying] = useState(state === "playing");

  return (
    <View style={{ flex: 2, backgroundColor: "transparent", flexDirection: "row", gap: 2 }}>
      <View style={{ flex: 2, flexDirection: "row", gap: 1, backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => {
            setPlaying(!isPlaying);
          }}
        >
          {/* Assuming you have appropriate icons for play and pause */}
          <Ionicons name={isPlaying ? "pause" : "play"} size={32} />
        </TouchableOpacity>
        {Array.from({ length: 20 }, (_, index) => {
          const randomNumber = Math.floor(Math.random() * 10) * 2;

          return (
            <View
              style={{ width: 1, backgroundColor: "green", borderRadius: 5, height: randomNumber }}
              key={index}
            />
          );
        })}
      </View>
    </View>
  );
};

// Interface for the MessageBlobProps
interface MessageBlobProps extends MessageBlobType {
  inAudioMode: boolean;
  setInAudioMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// MessageBlob component
const MessageBlob: React.FC<MessageBlobProps> = ({ type, text, audio, inAudioMode, setInAudioMode }) => {
  const baseStyle = "py-3 px-4 rounded-2xl mb-2 gap-1";
  let variantStyle = " ";
  if (type == "human") {
    variantStyle += "bg-green-300 dark:bg-green-700 ml-auto";
  } else if (type == "ai") {
    variantStyle += "bg-slate-100 dark:bg-amber-800 mr-auto";
  }

  return (
    <View style={{ flex: 1, backgroundColor: "transparent", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <Text style={{ color: type === "ai" ? "darkgreen" : "darkslategray", flex: 1 }}>
        {type === "ai" ? "Ella" : "Satyam"}
      </Text>
      {audio != null ? (
        <TouchableOpacity onPress={() => setInAudioMode(!inAudioMode)}>
          {/* Assuming you have appropriate icons for play and chat bubble */}
          <Ionicons name={inAudioMode ? "play-outline" : "chatbubble-outline"} style={{ flex: 1, padding: 8 }} />
        </TouchableOpacity>
      ) : null}
      {audio != null ? (
        inAudioMode ? <AudioPlayer url={audio} state="paused" /> : <Text style={{ color: type === "ai" ? "darkgreen" : "darkslategray" }}>{text}</Text>
      ) : (
        <Text style={{ color: type === "ai" ? "darkgreen" : "darkslategray" }}>{text}</Text>
      )}
    </View>
  );
};

// Interface for the ChatCardProps
interface ChatCardProps {
  messages: MessageBlobType[];
  onClose: () => void;
}

// ChatCard component
const ChatCard: React.FC<ChatCardProps> = ({ messages, onClose }) => {
  const [inAudioMode, setInAudioMode] = useState(true);

  return (
    <View style={{ position: "absolute", height: "90%", width: "90%", margin: 16, backgroundColor: "darkgray", borderRadius: 20 }}>
      <View style={{ height: 60, backgroundColor: "yellow", opacity: 0.8 }}>
        <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
          {/* You can use an icon for closing the chat card */}
          {/* Example: <Ionicons name="close" size={24} color="white" /> */}
        </TouchableOpacity>
      </View>
      <FlashList
        renderItem={({ item }) => (
          <MessageBlob {...item} inAudioMode={inAudioMode} setInAudioMode={setInAudioMode} />
        )}
        estimatedItemSize={50}
        data={messages}
        contentContainerStyle={{ padding: 15 }}
      />
    </View>
  );
};

export default ChatCard;