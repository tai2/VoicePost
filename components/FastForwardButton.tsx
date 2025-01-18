import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Borders } from "@/constants/Borders";

type Props = {
  onPress: () => void;
};

export const FastForwardButton = ({ onPress }: Props) => {
  return (
    <Pressable
      style={{
        width: Spacing[12],
        height: Spacing[12],
        ...Borders.border,
        ...Borders.rounded,
        borderColor: Colors.zinc200,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}
      accessibilityLabel="15秒進める"
    >
      <Feather name="rotate-cw" size={Spacing[5]} color={Colors.zinc950} />
    </Pressable>
  );
};
