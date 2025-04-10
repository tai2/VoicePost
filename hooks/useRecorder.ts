import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { Audio } from "expo-av";
import * as Linking from "expo-linking";
import { delay } from "@/lib/delay";

export const useRecorder = () => {
  const { t } = useTranslation();
  const recordingRef = useRef<Audio.Recording | null>(null);
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

  const [, requestPermission, getPermission] = Audio.usePermissions();

  const startRecording = async () => {
    if (isRecording || recordingRef.current) {
      throw "Recording is already started";
    }

    try {
      setIsProcessing(true);

      const permissionResponse = await getPermission();

      if (!permissionResponse.granted) {
        if (permissionResponse.canAskAgain) {
          await requestPermission();
        } else {
          Alert.alert(t("title.micPermission"), t("message.micPermission"), [
            {
              text: t("label.open"),
              onPress: () => Linking.openSettings(),
            },
          ]);
        }
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingStartedAt.current = performance.now();
      setRecordedDuration(0);
      setRecordedFile(null);
      recordingRef.current = recording;
      setIsRecording(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const stopRecording = async (): Promise<string> => {
    if (!isRecording || !recordingRef.current) {
      throw "Recording is not started";
    }

    try {
      setIsProcessing(true);

      // Immediate stop after the start sometimes makes the stopAndUnloadAsync unresponsive. To avoid that issue, we need
      // a small delay.
      await delay(100);

      await recordingRef.current.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recordingRef.current.getURI();
      if (!uri) {
        throw "Recording is not stored";
      }

      setRecordedFile(uri);
      recordingRef.current = null;
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
