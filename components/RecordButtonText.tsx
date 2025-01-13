import React from "react";
import { Text, TextStyle } from "react-native";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = {
  isRecording: boolean;
  onStop: () => void;
  onStart: () => void;
};

export const RecordButtonText = ({ isRecording, onStop, onStart }: Props) => {
  const iconSize = 24;
  const pressableStyle: StyleProp<ViewStyle> = {
    width: 160,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "hsl(240, 5.9%, 10%)",
  };
  const textStyle: StyleProp<TextStyle> = {
    fontSize: 20,
    color: "white",
  };

  return (
    <>
      {isRecording ? (
        <Pressable
          style={pressableStyle}
          accessibilityLabel="録音を停止する"
          onPress={onStop}
        >
          <MaterialIcons name="stop" size={iconSize} color="white" />

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
            color="hsl(0, 84.2%, 60.2%)"
          />
          <Text style={textStyle}>録音開始</Text>
        </Pressable>
      )}
    </>
  );
};
