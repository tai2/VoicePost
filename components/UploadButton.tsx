import React from "react";
import { useTranslation } from "react-i18next";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { ButtonText } from "./ButtonText";
import { ButtonPressable } from "./ButtonPressable";

type Props = {
  disabled: boolean;
  isUploading: boolean;
  progress: number;
  onPress: () => void;
};

export const UploadButton = ({
  disabled,
  isUploading,
  progress,
  onPress,
}: Props) => {
  const { t } = useTranslation();

  return (
    <ButtonPressable
      disabled={disabled}
      width="100%"
      accessibilityLabel={t("accessibilityLabel.upload")}
      onPress={onPress}
    >
      <AntDesign name="upload" size={Spacing[5]} color={Colors.zinc50} />
      <ButtonText>{t("label.upload")}</ButtonText>
      <Progress.Circle
        color={Colors.orangeInIcon}
        style={{ opacity: isUploading ? 1 : 0 }}
        size={Spacing[7]}
        progress={progress}
      />
    </ButtonPressable>
  );
};
