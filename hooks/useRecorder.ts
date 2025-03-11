import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { Audio } from "expo-av";
import * as Linking from "expo-linking";
import { delay } from "@/lib/delay";

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

  const [, requestPermission, getPermission] = Audio.usePermissions();

  async function startRecording() {
    if (isRecording || recordingRef.current) {
      throw "Recording is already started";
    }

    const permissionResponse = await getPermission();

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
      staysActiveInBackground: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    // Immediate stop after the start sometimes makes the stopAndUnloadAsync unresponsive. To avoid that issue,
    // We need a small delay.
    await delay(100);

    recordingStartedAt.current = performance.now();
    setRecordedDuration(0);
    setRecordedFile(null);
    recordingRef.current = recording;
    setIsRecording(true);
  }

  async function stopRecording(): Promise<string> {
    if (!isRecording || !recordingRef.current) {
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

    setRecordedFile(uri);
    recordingRef.current = null;
    setIsRecording(false);

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
