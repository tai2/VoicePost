import React from "react";
import { Pressable, Text, TextStyle } from "react-native";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  onPress: () => void;
};

export const PauseButton = ({ onPress }: Props) => {
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
      accessibilityLabel="再生中の音源を停止する"
    >
      <Feather name="pause" size={24} color="rgb(9, 9, 11)" />
      <Text style={{ fontSize: 20, color: "rgb(9, 9, 11)" }}>一時停止</Text>
    </Pressable>
  );
};
