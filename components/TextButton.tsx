import React, { PropsWithChildren } from "react";
import { DimensionValue, Pressable, Text } from "react-native";
import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

type Props = PropsWithChildren<{
  disabled?: boolean;
  width?: DimensionValue;
  accessibilityLabel: string;
  onPress: () => void;
}>;

export const TextButton = ({
  disabled,
  width,
  accessibilityLabel,
  onPress,
  children,
}: Props) => {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        {
          height: Spacing[12],
          width,
          paddingRight: Spacing[4],
          paddingLeft: Spacing[4],
          backgroundColor: pressed ? Colors.zinc300 : "transparent",
          alignItems: "center",
          justifyContent: "center",
        },
        Borders.border0,
        Borders.roundedXs,
      ]}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
    >
      <Text style={[{ color: Colors.sky500 }, Typography.textLg]}>
        {children}
      </Text>
    </Pressable>
  );
};
