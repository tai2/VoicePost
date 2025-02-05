import { Spacing } from "@/constants/Spacing";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Time } from "./Time";
import { TimeText } from "./TimeText";

type Props = {
  time:
    | {
        mode: "recorder";
        duration: number;
      }
    | {
        mode: "player";
        position: number;
        duration: number;
      };
};

export const PlayTime = ({ time }: Props) => {
  const durationOffset = -44;
  const durationLeft = useSharedValue(durationOffset);
  const positionOpacity = useSharedValue(0);

  useEffect(() => {
    if (time.mode === "player") {
      durationLeft.value = withTiming(0);
      positionOpacity.value = withTiming(1);
    } else {
      durationLeft.value = withTiming(durationOffset);
      positionOpacity.value = withTiming(0);
    }
  }, [time.mode, durationLeft, durationOffset, positionOpacity]);

  return (
    <View
      style={{
        flexDirection: "row",
        gap: Spacing[1.5],
      }}
    >
      <Animated.View
        style={{
          flexDirection: "row",
          gap: Spacing[1.5],
          opacity: positionOpacity,
        }}
      >
        <View style={{ left: 3 }}>
          <Time
            testID="time_position"
            time={time.mode === "player" ? time.position : 0}
          />
        </View>
        <TimeText>/</TimeText>
      </Animated.View>
      <Animated.View
        style={{
          left: durationLeft,
        }}
      >
        <Time testID="time_duration" time={time.duration} />
      </Animated.View>
    </View>
  );
};
