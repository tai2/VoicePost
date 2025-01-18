import React from "react";
import { Pressable, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Progress from "react-native-progress";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";

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
      accessibilityLabel="録音した音源をアップロードする"
    >
      <AntDesign name="upload" size={24} color={Colors.zinc950} />
      <Text style={{ ...Typography.textXl, color: Colors.zinc950 }}>
        アップロード
      </Text>
      <Progress.Circle
        style={{ opacity: isUploading ? 1 : 0 }}
        size={30}
        progress={progress}
      />
    </Pressable>
  );
};
