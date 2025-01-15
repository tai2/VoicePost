import React from "react";
import { Pressable, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Progress from "react-native-progress";

type Props = {
  disabled: boolean;
  isUploading: boolean;
  progress: number;
  onPress: () => void;
};

export const UploadButton = ({
  disabled,
  isUploading,
  progress,
  onPress,
}: Props) => {
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
      accessibilityLabel="録音した音源をアップロードする"
    >
      <AntDesign name="upload" size={24} color="rgb(9, 9, 11)" />
      <Text style={{ fontSize: 20, color: "rgb(9, 9, 11)" }}>アップロード</Text>
      <Progress.Circle
        style={{ opacity: isUploading ? 1 : 0 }}
        size={30}
        progress={progress}
      />
    </Pressable>
  );
};
