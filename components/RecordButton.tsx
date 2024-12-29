import React from "react";
import { Button } from "react-native";

type Props = {
  isRecording: boolean;
  onStop: () => void;
  onStart: () => void;
};

export const RecordButton = ({ isRecording, onStop, onStart }: Props) => {
  return (
    <>
      {isRecording ? (
        <Button
          title="停止"
          accessibilityLabel="録音を停止する"
          onPress={onStop}
        />
      ) : (
        <Button
          title="録音"
          accessibilityLabel="録音を開始する"
          onPress={onStart}
        />
      )}
    </>
  );
};
