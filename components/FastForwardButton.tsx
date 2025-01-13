import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Pressable } from "react-native";

type Props = {
  onPress: () => void;
};

export const FastForwardButton = ({ onPress }: Props) => {
  return (
    <Pressable
      style={{
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: "rgb(228, 228, 231)",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}
      accessibilityLabel="15秒進める"
    >
      <Feather name="rotate-cw" size={20} color="rgb(9, 9, 11)" />;
    </Pressable>
  );
};
