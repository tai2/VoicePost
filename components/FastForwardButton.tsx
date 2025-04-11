import React from "react";
import { useTranslation } from "react-i18next";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { ButtonPressable } from "./ButtonPressable";

type Props = {
  disabled?: boolean;
  onPress: () => void;
};

export const FastForwardButton = ({ disabled, onPress }: Props) => {
  const { t } = useTranslation();

  return (
    <ButtonPressable
      disabled={disabled}
      accessibilityLabel={t("accessibilityLabel.fastForward")}
      onPress={onPress}
    >
      <Feather name="rotate-cw" size={Spacing[5]} color={Colors.zinc50} />
    </ButtonPressable>
  );
};
