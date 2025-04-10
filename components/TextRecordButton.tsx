import React from "react";
import { Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { Borders } from "@/constants/Borders";
import { RecordStopIcon } from "./RecordStopIcon";

type Props = {
  isRecording: boolean;
  isProcessing: boolean;
  onStop: () => void;
  onStart: () => void;
};

export const TextRecordButton = ({
  isRecording,
  isProcessing,
  onStop,
  onStart,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Pressable
      style={({ pressed }) => [
        {
          gap: Spacing[3],
          paddingVertical: Spacing[4],
          paddingHorizontal: Spacing[6],
          backgroundColor: Colors.zinc50,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          opacity: pressed ? 0.5 : 1,
        },
        Borders.roundedFull,
      ]}
      accessibilityLabel={
        isRecording
          ? t("accessibilityLabel.stopRecording")
          : t("accessibilityLabel.startRecording")
      }
      disabled={isProcessing}
      onPress={isRecording ? onStop : onStart}
    >
      <RecordStopIcon size={Spacing[4]} isRecording={isRecording} />
      <Text
        style={[
          {
            color: Colors.blue1InIcon,
          },
          Typography.textXl,
        ]}
      >
        {isRecording ? t("label.stopRecording") : t("label.startRecording")}
      </Text>
    </Pressable>
  );
};
