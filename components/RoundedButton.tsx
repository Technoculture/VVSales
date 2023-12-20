import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { TouchableOpacity } from "react-native";

type IoniconsNames =
  | "infinite"
  | "filter"
  | "search"
  | "repeat"
  | "link"
  | "at"
  | "body"
  | "code"
  | "map"
  | "menu"
  | "time"
  | "ellipse"
  | "image"
  | "stop"
  | "text"
  | "key"
  | "push"
  | "call"
  | "camera"
  | "grid"
  | /* Add other valid names */ undefined;

interface RoundedButtonProps {
  icon: IoniconsNames;
  className?: string;
  type: string;
  onPress?: () => void;
}

export function RoundedButton({
  icon,
  className,
  type,
  onPress,
}: RoundedButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity
      className={`bg-gray-800 dark:bg-green-950 h-20 w-20 rounded-full items-center justify-center ${className}`}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={32}
        color={type === "primary" ? "white" : "black"}
        className=""
      />
    </TouchableOpacity>
  );
}
