import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useAudioRecorder, AudioModule, RecordingPresets } from "expo-audio";
import * as Linking from "expo-linking";
import { delay } from "@/lib/delay";

export const useRecorder = () => {
  const { t } = useTranslation();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recordingStartedAt = useRef<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [recordedDuration, setRecordedDuration] = useState<number>(0);
  const [recordedFile, setRecordedFile] = useState<string | null>(null);

  useEffect(() => {
    if (isRecording) {
      requestAnimationFrame((t) => {
        if (!isRecording) {
          return;
        }
        setRecordedDuration(t - recordingStartedAt.current);
      });
    }
  }, [isRecording, recordedDuration]);

  const startRecording = async () => {
    if (isRecording) {
      throw "Recording is already started";
    }

    try {
      setIsProcessing(true);

      const permissionResponse =
        await AudioModule.getRecordingPermissionsAsync();
      if (!permissionResponse.granted) {
        if (!permissionResponse.canAskAgain) {
          Alert.alert(t("title.micPermission"), t("message.micPermission"), [
            {
              text: t("label.open"),
              onPress: () => Linking.openSettings(),
            },
          ]);
          return;
        }

        const requestResult =
          await await AudioModule.requestRecordingPermissionsAsync();
        if (!requestResult.granted) {
          return;
        }
      }

      await AudioModule.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        shouldPlayInBackground: true,
      });

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();

      recordingStartedAt.current = performance.now();
      setRecordedDuration(0);
      setRecordedFile(null);
      setIsRecording(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const stopRecording = async (): Promise<string> => {
    if (!isRecording) {
      throw "Recording is not started";
    }

    try {
      setIsProcessing(true);

      await audioRecorder.stop();

      const uri = audioRecorder.uri;
      if (!uri) {
        throw "Recording is not stored";
      }

      setRecordedFile(uri);
      setIsRecording(false);

      return uri;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isRecording,
    isProcessing,
    recordedDuration,
    recordedFile,
    startRecording,
    stopRecording,
  };
};
