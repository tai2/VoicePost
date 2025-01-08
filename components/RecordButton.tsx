import React from "react";
import {
  DimensionValue,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  isRecording: boolean;
  onStop: () => void;
  onStart: () => void;
};

export const RecordButton = ({ isRecording, onStop, onStart }: Props) => {
  const size = 200;
  const innerSize = size * 0.7;
  const iconSize = size * 0.4;

  const pressableStyle: StyleProp<ViewStyle> = {
    width: innerSize,
    height: innerSize,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  };
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "hsl(240, 4.8%, 95.9%)",
      }}
    >
      {isRecording ? (
        <Pressable
          style={{ ...pressableStyle, backgroundColor: "hsl(0, 84.2%, 60.2%)" }}
          accessibilityLabel="録音を停止する"
          onPress={onStop}
        >
          <Feather name="mic" size={iconSize} color="white" />
        </Pressable>
      ) : (
        <Pressable
          style={{ ...pressableStyle, backgroundColor: "hsl(240, 5.9%, 10%)" }}
          accessibilityLabel="録音を開始する"
          onPress={onStart}
        >
          <Feather name="mic" size={iconSize} color="white" />
        </Pressable>
      )}
    </View>
  );
};
