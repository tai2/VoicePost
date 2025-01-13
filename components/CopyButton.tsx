import React from "react";
import { Pressable, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";

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
        borderColor: "rgb(228, 228, 231)",
        borderRadius: 5,
        alignItems: "center",
        gap: 10,
        paddingRight: 20,
        paddingLeft: 20,
      }}
      onPress={onPress}
      accessibilityLabel="アップロードした音源をURLをコピーする"
    >
      <Feather name="copy" size={24} color="rgb(9, 9, 11)" />
      <Text style={{ fontSize: 20, color: "rgb(9, 9, 11)" }}>コピー</Text>
    </Pressable>
  );
};
