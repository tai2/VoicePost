import React from "react";
import { Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Borders } from "@/constants/Borders";
import { ButtonText } from "./ButtonText";

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
      <Feather name="copy" size={Spacing[5]} color={Colors.zinc950} />
      <ButtonText>コピー</ButtonText>
    </Pressable>
  );
};
