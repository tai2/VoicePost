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

export const CopyButton = ({ disabled, onPress }: Props) => {
  return (
    <ButtonPressable
      disabled={disabled}
      accessibilityLabel="アップロードした音源をURLをコピーする"
      onPress={onPress}
    >
      <Feather name="copy" size={Spacing[5]} color={Colors.zinc950} />
      <ButtonText>コピー</ButtonText>
    </ButtonPressable>
  );
};
