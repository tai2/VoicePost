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

export const PlayButton = ({ disabled, onPress }: Props) => {
  return (
    <ButtonPressable
      disabled={disabled}
      accessibilityLabel="録音した音源を再生する"
      onPress={onPress}
    >
      <Icon name="play" size={Spacing[5]} color={Colors.zinc50} />
      <ButtonText>再生</ButtonText>
    </ButtonPressable>
  );
};
