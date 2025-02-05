import { useEffect, useRef, useState } from "react";
import { StyleSheet, Button, Alert } from "react-native";
import { Audio } from "expo-av";
import * as Linking from "expo-linking";

export const useRecorder = () => {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const recordingStartedAt = useRef<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
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

  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    if (!permissionResponse) {
      throw new Error("Permission response is not ready");
    }

    if (!permissionResponse.granted) {
      if (permissionResponse.canAskAgain) {
        await requestPermission();
      } else {
        Alert.alert("マイク権限", "設定からマイクの使用を許可してください", [
          {
            text: "開く",
            onPress: () => Linking.openSettings(),
          },
        ]);
      }
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    recordingRef.current = recording;

    setIsRecording(true);
    recordingStartedAt.current = performance.now();
    setRecordedDuration(0);
    setRecordedFile(null);
  }

  async function stopRecording(): Promise<string> {
    if (!recordingRef.current) {
      throw "Recording is not started";
    }

    await recordingRef.current.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recordingRef.current.getURI();
    if (!uri) {
      throw "Recording is not stored";
    }

    setIsRecording(false);
    setRecordedFile(uri);

    return uri;
  }

  return {
    isRecording,
    recordedDuration,
    recordedFile,
    startRecording,
    stopRecording,
  };
};
