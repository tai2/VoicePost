import React from "react";
import { Pressable, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { Borders } from "@/constants/Borders";

type Props = {
  disabled?: boolean;
  onPress: () => void;
};

export const CopyButton = ({ disabled, onPress }: Props) => {
  return (
    <Pressable
      disabled={disabled}
      style={{
        height: Spacing[12],
        gap: Spacing[2.5],
        paddingRight: Spacing[5],
        paddingLeft: Spacing[5],
        ...Borders.border,
        ...Borders.rounded,
        borderColor: Colors.zinc200,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={onPress}
      accessibilityLabel="アップロードした音源をURLをコピーする"
    >
      <Feather name="copy" size={24} color={Colors.zinc950} />
      <Text style={{ ...Typography.textXl, color: Colors.zinc950 }}>
        コピー
      </Text>
    </Pressable>
  );
};
