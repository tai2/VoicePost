import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Props = {
  onPress: () => void;
};

export const FastForwardButton = ({ onPress }: Props) => {
  return (
    <Pressable
      style={{
        width: Spacing[12],
        height: Spacing[12],
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
