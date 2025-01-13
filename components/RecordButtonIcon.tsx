import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DimensionValue, Pressable, View } from "react-native";
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
  const innerSquareSize = size * 0.5;
  const iconSize = size * 0.4;

  useLayoutEffect(() => {
    rootRef.current?.measure((x_, y_, width_, height) => {
      setSize(height);
    });
  }, [setSize]);

  return (
    <View
      ref={rootRef}
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
          style={{
            width: innerSquareSize,
            height: innerSquareSize,
            borderRadius: "5%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "hsl(240, 5.9%, 10%)",
          }}
          accessibilityLabel="録音を停止する"
          onPress={onStop}
        >
          <Feather name="mic" size={iconSize} color="white" />
        </Pressable>
      ) : (
        <Pressable
          style={{
            width: innerCircleSize,
            height: innerCircleSize,
            borderRadius: "50%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "hsl(0, 84.2%, 60.2%)",
          }}
          accessibilityLabel="録音を開始する"
          onPress={onStart}
        >
          <Feather name="mic" size={iconSize} color="white" />
        </Pressable>
      )}
    </View>
  );
};
