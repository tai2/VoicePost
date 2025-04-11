import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <ButtonPressable
      disabled={disabled}
      accessibilityLabel={t("accessibilityLabel.stopPlayback")}
      onPress={onPress}
    >
      <Icon name="pause" size={Spacing[5]} color={Colors.zinc50} />
      <ButtonText>{t("label.pause")}</ButtonText>
    </ButtonPressable>
  );
};
