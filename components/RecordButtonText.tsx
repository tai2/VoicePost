import React from "react";
import { DimensionValue, Text, TextStyle } from "react-native";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";

type Props = {
  isRecording: boolean;
  onStop: () => void;
  onStart: () => void;
};

export const RecordButtonText = ({ isRecording, onStop, onStart }: Props) => {
  const pressableStyle: StyleProp<ViewStyle> = {
    width: 160,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
  };
  const textStyle: StyleProp<TextStyle> = {
    fontSize: 20,
    color: "white",
  };

  return (
    <>
      {isRecording ? (
        <Pressable
          style={{ ...pressableStyle, backgroundColor: "hsl(240, 5.9%, 10%)" }}
          accessibilityLabel="録音を停止する"
          onPress={onStop}
        >
          <Text style={textStyle}>録音停止</Text>
        </Pressable>
      ) : (
        <Pressable
          style={{ ...pressableStyle, backgroundColor: "hsl(0, 84.2%, 60.2%)" }}
          accessibilityLabel="録音を開始する"
          onPress={onStart}
        >
          <Text style={textStyle}>録音開始</Text>
        </Pressable>
      )}
    </>
  );
};
