import React from "react";
import { Pressable, Text, TextStyle } from "react-native";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  onPress: () => void;
};

export const PlayButton = ({ onPress }: Props) => {
  return (
    <Pressable
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
      accessibilityLabel="録音した音源を再生する"
    >
      <Feather name="play" size={24} color="rgb(9, 9, 11)" />
      <Text style={{ fontSize: 20, color: "rgb(9, 9, 11)" }}>録音開始</Text>
    </Pressable>
  );
};
