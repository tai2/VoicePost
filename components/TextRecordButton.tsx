import React from "react";
import { Text, TextStyle } from "react-native";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
  const iconSize = Spacing[6];
  const pressableStyle: StyleProp<ViewStyle> = [
    {
      width: Spacing[40],
      gap: Spacing[1.5],
      padding: Spacing[4],
      backgroundColor: Colors.zinc900,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
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
          <MaterialIcons name="stop" size={iconSize} color={Colors.neutral50} />

          <Text style={textStyle}>録音停止</Text>
        </Pressable>
      ) : (
        <Pressable
          style={pressableStyle}
          accessibilityLabel="録音を開始する"
          onPress={onStart}
        >
          <MaterialIcons
            name="fiber-manual-record"
            size={iconSize}
            color={Colors.red500}
          />
          <Text style={textStyle}>録音開始</Text>
        </Pressable>
      )}
    </>
  );
};
