import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { ButtonPressable } from "./ButtonPressable";

type Props = {
  disabled?: boolean;
  onPress: () => void;
};

export const RewindButton = ({ disabled, onPress }: Props) => {
  return (
    <ButtonPressable
      disabled={disabled}
      accessibilityLabel="15秒戻す"
      onPress={onPress}
    >
      <Feather name="rotate-ccw" size={Spacing[5]} color={Colors.zinc50} />
    </ButtonPressable>
  );
};
