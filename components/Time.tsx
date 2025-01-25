import React from "react";
import { View } from "react-native";
import { TimeText } from "./TimeText";

type Props = {
  time: number;
};

export const Time = ({ time }: Props) => {
  return (
    <View
      style={{
        // To make the position stable, we need to specify just enough size for 4 ditis and a colon.
        alignItems: "flex-start",
        width: 72,
      }}
    >
      <TimeText>{formatTime(time)}</TimeText>
    </View>
  );
};

const formatTime = (duration: number): string => {
  const durationSeconds = duration / 1000;
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);
  return `${pad2(minutes)}:${pad2(seconds)}`;
};

const pad2 = (n: number): string => n.toString().padStart(2, "0");
