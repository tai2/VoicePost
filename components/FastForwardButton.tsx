import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Pressable } from "react-native";
import { Colors } from "@/constants/Colors";

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
        borderColor: Colors.zinc200,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}
      accessibilityLabel="15秒進める"
    >
      <Feather name="rotate-cw" size={20} color={Colors.zinc950} />
    </Pressable>
  );
};
