import React from "react";
import Icon from "@expo/vector-icons/FontAwesome6";
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
      accessibilityLabel="再生中の音源を停止する"
      onPress={onPress}
    >
      <Icon name="pause" size={Spacing[5]} color={Colors.zinc50} />
      <ButtonText>一時停止</ButtonText>
    </ButtonPressable>
  );
};
