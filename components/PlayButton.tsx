import React from "react";
import { Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Borders } from "@/constants/Borders";
import { ButtonText } from "./ButtonText";
import { ButtonPressable } from "./ButtonPressable";

type Props = {
  disabled?: boolean;
  onPress: () => void;
};

export const PlayButton = ({ disabled, onPress }: Props) => {
  return (
    <ButtonPressable
      disabled={disabled}
      accessibilityLabel="録音した音源を再生する"
      onPress={onPress}
    >
      <Feather name="play" size={Spacing[5]} color={Colors.zinc950} />
      <ButtonText>再生</ButtonText>
    </ButtonPressable>
  );
};
