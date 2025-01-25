import React from "react";
import {
  PressableStateCallbackType,
  Text,
  TextStyle,
  View,
} from "react-native";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { Borders } from "@/constants/Borders";

type Props = {
  isRecording: boolean;
  onStop: () => void;
  onStart: () => void;
};

export const TextRecordButton = ({ isRecording, onStop, onStart }: Props) => {
  const iconSize = Spacing[5];
  const pressableStyle: (
    state: PressableStateCallbackType
  ) => StyleProp<ViewStyle> = ({ pressed }) => [
    {
      width: Spacing[40],
      gap: Spacing[2],
      padding: Spacing[4],
      backgroundColor: Colors.zinc900,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      opacity: pressed ? 0.5 : 1,
    },
    Borders.roundedLg,
  ];
  const textStyle: StyleProp<TextStyle> = [
    {
      color: Colors.neutral50,
    },
    Typography.textXl,
  ];

  return (
    <>
      {isRecording ? (
        <Pressable
          style={pressableStyle}
          accessibilityLabel="録音を停止する"
          onPress={onStop}
        >
          <View
            style={{
              width: iconSize,
              height: iconSize,
              backgroundColor: Colors.neutral50,
              borderRadius: 0,
            }}
          />
          <Text style={textStyle}>録音停止</Text>
        </Pressable>
      ) : (
        <Pressable
          style={pressableStyle}
          accessibilityLabel="録音を開始する"
          onPress={onStart}
        >
          <View
            style={{
              width: iconSize,
              height: iconSize,
              backgroundColor: Colors.red500,
              borderRadius: iconSize / 2,
            }}
          />
          <Text style={textStyle}>録音開始</Text>
        </Pressable>
      )}
    </>
  );
};
