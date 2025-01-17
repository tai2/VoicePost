import React from "react";
import { Pressable, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";

type Props = {
  disabled?: boolean;
  onPress: () => void;
};

export const CopyButton = ({ disabled, onPress }: Props) => {
  return (
    <Pressable
      disabled={disabled}
      style={{
        height: 50,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: Colors.zinc200,
        borderRadius: 5,
        alignItems: "center",
        gap: 10,
        paddingRight: 20,
        paddingLeft: 20,
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
