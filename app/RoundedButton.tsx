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
  | /* Add other valid names */ undefined;

interface RoundedButtonProps {
  trigger: () => void;
  icon: IoniconsNames;
  className?: string;
  type: string;
  onPress?: () => void;
}

export function RoundedButton({
  trigger,
  icon,
  className,
  type,
  onPress,
}: RoundedButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity
      className={`bg-green-600 dark:bg-green-950 h-20 w-20 rounded-full items-center justify-center ${className}`}
      onPress={onPress || trigger}
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
