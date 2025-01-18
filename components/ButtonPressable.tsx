import { Borders } from "@/constants/Borders";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import React, { PropsWithChildren } from "react";
import { Pressable } from "react-native";

type Props = PropsWithChildren<{
  disabled?: boolean;
  accessibilityLabel: string;
  onPress: () => void;
}>;

export const ButtonPressable = ({
  disabled,
  accessibilityLabel,
  onPress,
  children,
}: Props) => {
  return (
    <Pressable
      disabled={disabled}
      style={{
        height: Spacing[12],
        gap: Spacing[2],
        paddingRight: Spacing[4],
        paddingLeft: Spacing[4],
        ...Borders.border,
        ...Borders.rounded,
        borderColor: Colors.zinc200,
        flexDirection: "row",
        alignItems: "center",
      }}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};
