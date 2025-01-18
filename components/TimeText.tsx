import React, { PropsWithChildren } from "react";
import { Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";

type Props = PropsWithChildren<{}>;

export const TimeText = ({ children }: Props) => {
  return (
    <Text
      style={{
        color: Colors.zinc900,
        ...Typography.text2Xl,
        ...Typography.fontSemibold,
      }}
    >
      {children}
    </Text>
  );
};
