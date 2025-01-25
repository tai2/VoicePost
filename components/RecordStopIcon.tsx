import { Colors } from "@/constants/Colors";
import { View } from "react-native";

type Props = {
  size: number;
  isRecording: boolean;
};

export const RecordStopIcon = ({ size, isRecording }: Props) => {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
        },
        isRecording
          ? {
              backgroundColor: Colors.neutral50,
              borderRadius: 0,
            }
          : {
              backgroundColor: Colors.red500,
              borderRadius: size / 2,
            },
      ]}
    />
  );
};
