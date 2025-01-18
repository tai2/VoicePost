import React from "react";
import { Pressable, Text, TextStyle } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";

type Props = {
  onPress: () => void;
};

export const PlayButton = ({ onPress }: Props) => {
  return (
    <Pressable
      style={{
        height: Spacing[12],
        gap: Spacing[2.5],
        paddingRight: Spacing[5],
        paddingLeft: Spacing[5],
        flexDirection: "row",
        borderWidth: 1,
        borderColor: Colors.zinc200,
        borderRadius: 5,
        alignItems: "center",
      }}
      onPress={onPress}
      accessibilityLabel="録音した音源を再生する"
    >
      <Feather name="play" size={24} color={Colors.zinc950} />
      <Text style={{ ...Typography.textXl, color: Colors.zinc950 }}>再生</Text>
    </Pressable>
  );
};
