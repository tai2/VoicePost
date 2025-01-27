import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";

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

    if (permissionResponse.status !== "granted") {
      // TODO: Handle permission request
      await requestPermission();
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
