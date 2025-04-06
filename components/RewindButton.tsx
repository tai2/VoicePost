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

export const RewindButton = ({ disabled, onPress }: Props) => {
  const { t } = useTranslation();

  return (
    <ButtonPressable
      disabled={disabled}
      accessibilityLabel={t("accessibilityLabel.rewind")}
      onPress={onPress}
    >
      <Feather name="rotate-ccw" size={Spacing[5]} color={Colors.zinc50} />
    </ButtonPressable>
  );
};
