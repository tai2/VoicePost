import { Colors } from "@/constants/Colors";
import { useEffect } from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  size: number;
  isRecording: boolean;
};

export const RecordStopIcon = ({ size, isRecording }: Props) => {
  const progress = useSharedValue(1);

  useEffect(() => {
    progress.value = isRecording ? 0 : 1;
  }, [isRecording, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    borderRadius: withTiming((progress.value * size) / 2),
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [Colors.blue1InIcon, Colors.orangeInIcon]
    ),
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
        },
        animatedStyle,
      ]}
    />
  );
};
