import React, { PropsWithChildren } from "react";
import { DimensionValue, Pressable } from "react-native";
import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

type Props = PropsWithChildren<{
  disabled?: boolean;
  width?: DimensionValue;
  accessibilityLabel: string;
  onPress: () => void;
}>;

export const ButtonPressable = ({
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
          gap: Spacing[2],
          paddingRight: Spacing[4],
          paddingLeft: Spacing[4],
          borderColor: Colors.zinc200,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pressed ? Colors.zinc300 : "transparent",
        },
        Borders.border,
        Borders.roundedSm,
      ]}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};
