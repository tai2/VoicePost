import React from "react";
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
  return (
    <ButtonPressable
      disabled={disabled}
      accessibilityLabel="録音した音源をアップロードする"
      onPress={onPress}
    >
      <AntDesign name="upload" size={Spacing[5]} color={Colors.zinc950} />
      <ButtonText>アップロード</ButtonText>
      <Progress.Circle
        style={{ opacity: isUploading ? 1 : 0 }}
        size={Spacing[7]}
        progress={progress}
        color={disabled ? Colors.zinc500 : undefined}
      />
    </ButtonPressable>
  );
};
