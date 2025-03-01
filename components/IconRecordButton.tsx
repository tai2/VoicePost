import React, { useEffect, useRef, useState } from "react";
import {
  DimensionValue,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";

type Props = {
  height: DimensionValue;
  isRecording: boolean;
  onStop: () => void;
  onStart: () => void;
};

export const IconRecordButton = ({
  height,
  isRecording,
  onStop,
  onStart,
}: Props) => {
  const rootRef = useRef<View>(null);
  const [size, setSize] = useState<number>(0);
  const innerCircleSize = size * 0.7;
  const iconSize = size * 0.4;
  const opacity = useSharedValue(1.0);

  useEffect(() => {
    opacity.value = isRecording
      ? withRepeat(withTiming(0.5, { duration: 1000 }), 0, true)
      : withTiming(1);
  }, [opacity, isRecording]);

  const circleStyle: (
    state: PressableStateCallbackType
  ) => StyleProp<ViewStyle> = ({ pressed }) => ({
    width: innerCircleSize,
    height: innerCircleSize,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.orangeInIcon,
    opacity: pressed ? 0.5 : 1,
  });
  return (
    <Animated.View
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
        backgroundColor: Colors.zinc100,
        opacity,
      }}
    >
      {
        // rendering icon with size zero causes crash
        iconSize > 0 ? (
          <>
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
          </>
        ) : null
      }
    </Animated.View>
  );
};
