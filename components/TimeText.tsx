import React, { PropsWithChildren } from "react";
import { Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";

type Props = PropsWithChildren<{
  testID?: string;
}>;

export const TimeText = ({ testID, children }: Props) => {
  return (
    <Text
      testID={testID}
      style={[
        {
          color: Colors.zinc50,
        },
        Typography.text2Xl,
        Typography.fontSemibold,
      ]}
    >
      {children}
    </Text>
  );
};
