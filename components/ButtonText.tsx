import React, { PropsWithChildren } from "react";
import { Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";

type Props = PropsWithChildren<{}>;

export const ButtonText = ({ children }: Props) => {
  return (
    <Text style={{ ...Typography.textLg, color: Colors.zinc950 }}>
      {children}
    </Text>
  );
};
