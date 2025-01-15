import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  DimensionValue,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  height: DimensionValue;
  isRecording: boolean;
  onStop: () => void;
  onStart: () => void;
};

export const RecordButtonIcon = ({
  height,
  isRecording,
  onStop,
  onStart,
}: Props) => {
  const rootRef = useRef<View>(null);
  const [size, setSize] = useState<number>(0);
  const innerCircleSize = size * 0.7;
  const iconSize = size * 0.4;

  const circleStyle: StyleProp<ViewStyle> = {
    width: innerCircleSize,
    height: innerCircleSize,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "hsl(0, 84.2%, 60.2%)",
  };
  return (
    <View
      ref={rootRef}
      onLayout={(event) => {
        setSize(event.nativeEvent.layout.height);
      }}
      style={{
        width: size,
        height: height,
        borderRadius: "50%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "hsl(240, 4.8%, 95.9%)",
      }}
    >
      {isRecording ? (
        <Pressable
          style={circleStyle}
          accessibilityLabel="録音を停止する"
          onPress={onStop}
        >
          <Feather name="mic" size={iconSize} color="white" />
        </Pressable>
      ) : (
        <Pressable
          style={circleStyle}
          accessibilityLabel="録音を開始する"
          onPress={onStart}
        >
          <Feather name="mic" size={iconSize} color="white" />
        </Pressable>
      )}
    </View>
  );
};
