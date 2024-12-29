import React from "react";
import { Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  isRecording: boolean;
  onStop: () => void;
  onStart: () => void;
};

export const RecordButton = ({ isRecording, onStop, onStart }: Props) => {
  const iconSize = 64;
  return (
    <>
      {isRecording ? (
        <Pressable accessibilityLabel="録音を停止する" onPress={onStop}>
          <Feather name="mic" size={iconSize} color="black" />
        </Pressable>
      ) : (
        <Pressable accessibilityLabel="録音を開始する" onPress={onStart}>
          <Feather name="mic" size={iconSize} color="red" />
        </Pressable>
      )}
    </>
  );
};
