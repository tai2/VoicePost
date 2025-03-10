import React from "react";
import Icon from "@expo/vector-icons/Ionicons";
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
      width="100%"
      accessibilityLabel="アップロードした音源のURLをコピーする"
      onPress={onPress}
    >
      <Icon name="copy" size={Spacing[5]} color={Colors.zinc50} />
      <ButtonText>コピー</ButtonText>
    </ButtonPressable>
  );
};
