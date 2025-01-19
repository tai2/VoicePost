import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { ButtonText } from "./ButtonText";
import { ButtonPressable } from "./ButtonPressable";

type Props = {
  disabled?: boolean;
  onPress: () => void;
};

export const PauseButton = ({ disabled, onPress }: Props) => {
  return (
    <ButtonPressable
      disabled={disabled}
      width={Spacing[32]}
      accessibilityLabel="再生中の音源を停止する"
      onPress={onPress}
    >
      <Feather name="pause" size={Spacing[5]} color={Colors.zinc950} />
      <ButtonText>一時停止</ButtonText>
    </ButtonPressable>
  );
};
