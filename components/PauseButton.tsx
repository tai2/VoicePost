import React from "react";
import { Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Borders } from "@/constants/Borders";
import { ButtonText } from "./ButtonText";

type Props = {
  onPress: () => void;
};

export const PauseButton = ({ onPress }: Props) => {
  return (
    <Pressable
      style={{
        height: Spacing[12],
        gap: Spacing[2.5],
        paddingRight: Spacing[5],
        paddingLeft: Spacing[5],
        ...Borders.border,
        ...Borders.rounded,
        borderColor: Colors.zinc200,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={onPress}
      accessibilityLabel="再生中の音源を停止する"
    >
      <Feather name="pause" size={Spacing[5]} color={Colors.zinc950} />
      <ButtonText>一時停止</ButtonText>
    </Pressable>
  );
};
