import React from "react";
import { Text, View } from "react-native";
import { Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { Borders } from "@/constants/Borders";
import { useSharedValue } from "react-native-reanimated";
import { RecordStopIcon } from "./RecordStopIcon";

type Props = {
  isRecording: boolean;
  onStop: () => void;
  onStart: () => void;
};

export const TextRecordButton = ({ isRecording, onStop, onStart }: Props) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          width: Spacing[40],
          gap: Spacing[3],
          padding: Spacing[4],
          backgroundColor: Colors.zinc900,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          opacity: pressed ? 0.5 : 1,
        },
        Borders.roundedLg,
      ]}
      accessibilityLabel={isRecording ? "録音を停止する" : "録音を開始する"}
      onPress={isRecording ? onStop : onStart}
    >
      <RecordStopIcon size={Spacing[4]} isRecording={isRecording} />
      <Text
        style={[
          {
            color: Colors.neutral50,
          },
          Typography.textXl,
        ]}
      >
        {isRecording ? "録音停止" : "録音開始"}
      </Text>
    </Pressable>
  );
};
