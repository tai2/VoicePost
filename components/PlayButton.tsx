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

export const PlayButton = ({ disabled, onPress }: Props) => {
  const { t } = useTranslation();

  return (
    <ButtonPressable
      disabled={disabled}
      accessibilityLabel={t("accessibilityLabel.startPlayback")}
      onPress={onPress}
    >
      <Icon name="play" size={Spacing[5]} color={Colors.zinc50} />
      <ButtonText>{t("label.play")}</ButtonText>
    </ButtonPressable>
  );
};
