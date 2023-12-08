import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { TouchableOpacity } from "react-native";

interface RoundedButtonProps {
  trigger: () => void;
  icon: string;
  className?: string;
  type: string;
}

export function RoundedButton({
  trigger,
  icon,
  className,
  type,
}: RoundedButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity
      className={`bg-green-600 dark:bg-green-950 h-20 w-20 rounded-full items-center justify-center ${className}`}
      onPress={trigger}
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
