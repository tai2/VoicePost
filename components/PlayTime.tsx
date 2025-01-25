import { Spacing } from "@/constants/Spacing";
import React from "react";
import { View } from "react-native";
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
  return time.mode === "player" ? (
    <View style={{ flexDirection: "row", gap: Spacing[1.5] }}>
      <Time time={time.position} />
      <TimeText>/</TimeText>
      <Time time={time.duration} />
    </View>
  ) : (
    <Time time={time.duration} />
  );
};
