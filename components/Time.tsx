import React from "react";
import { Text } from "react-native";
import { Colors } from "@/constants/Colors";

type Props = {
  time: number;
};

export const Time = ({ time }: Props) => {
  return (
    <Text style={{ color: Colors.zinc900, fontSize: 28, fontWeight: 600 }}>
      {formatTime(time)}
    </Text>
  );
};

const formatTime = (duration: number): string => {
  const durationSeconds = duration / 1000;
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);
  return `${pad2(minutes)}:${pad2(seconds)}`;
};

const pad2 = (n: number): string => n.toString().padStart(2, "0");
