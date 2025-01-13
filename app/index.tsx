import { useEffect, useState, useRef } from "react";
import { Text, View, Button, Pressable } from "react-native";
import Toast from "react-native-root-toast";
import * as Progress from "react-native-progress";
import Slider from "@react-native-community/slider";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import uuid from "react-native-uuid";
import { Link, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_PRESERVE_DURATION } from "@/constants/values";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { RecordButtonIcon } from "@/components/RecordButtonIcon";
import { RecordButtonText } from "@/components/RecordButtonText";
import { Time } from "@/components/Time";

export default function Index() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const recordingStartedAt = useRef<number>(0);
  const [recordedDuration, setRecordedDuration] = useState<number>(0);
  const [recordedFile, setRecordedAudio] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [soundPosition, setSoundPosition] = useState<number>(0);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      if (!permissionResponse) {
        throw new Error("Permission response is not ready");
      }

      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      console.log("Recording started");
      recordingRef.current = recording;

      setIsRecording(true);
      recordingStartedAt.current = performance.now();
      setRecordedDuration(0);
      setRecordedAudio(null);
      setUploadedFileUrl(null);
      setIsUploading(false);
      setUploadProgress(0);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    if (!recordingRef.current) {
      console.error("Recording is not started");
      return;
    }

    await recordingRef.current.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recordingRef.current.getURI();
    if (!uri) {
      console.error("Recording is not stored");
      return;
    }

    console.log("Recording stopped and stored at", uri);

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      undefined,
      (status) => {
        if (!status.isLoaded) {
          return;
        }

        if (status.didJustFinish) {
          setIsPlaying(false);
          setSoundPosition(0);
          return;
        }

        if (status.isPlaying && status.durationMillis) {
          setSoundPosition(status.positionMillis / status.durationMillis);
        }
      }
    );
    soundRef.current = sound;

    setIsRecording(false);
    setSoundPosition(0);
    setRecordedAudio(uri);
  }

  async function playSound() {
    const sound = soundRef.current;
    if (!sound) {
      console.error("Sound is not loaded");
      return;
    }

    console.log("Playing Sound");
    await sound.playAsync();
  }

  async function pauseSound() {
    const sound = soundRef.current;
    if (!sound) {
      console.error("Sound is not loaded");
      return;
    }

    await sound.pauseAsync();
  }

  async function forward() {
    const sound = soundRef.current;
    if (!sound) {
      console.error("Sound is not loaded");
      return;
    }

    const status = await sound.getStatusAsync();
    if (!status.isLoaded || !status.durationMillis) {
      console.error("Sound is not loaded");
      return;
    }

    const positionMillis = status.positionMillis + 5000;
    sound.setStatusAsync({
      positionMillis,
    });
    setSoundPosition(Math.min(1, positionMillis / status.durationMillis));
  }

  async function rewind() {
    const sound = soundRef.current;
    if (!sound) {
      console.error("Sound is not loaded");
      return;
    }

    const status = await sound.getStatusAsync();
    if (!status.isLoaded || !status.durationMillis) {
      console.error("Sound is not loaded");
      return;
    }

    const positionMillis = status.positionMillis - 5000;
    sound.setStatusAsync({
      positionMillis,
    });
    setSoundPosition(Math.max(0, positionMillis / status.durationMillis));
  }

  async function changePosition(position: number) {
    const sound = soundRef.current;
    if (!sound) {
      console.error("Sound is not loaded");
      return;
    }

    const status = await sound.getStatusAsync();
    if (!status.isLoaded || !status.durationMillis) {
      console.error("Sound is not loaded");
      return;
    }

    sound.setStatusAsync({
      positionMillis: status.durationMillis * position,
    });
  }

  useEffect(() => {
    if (isRecording) {
      requestAnimationFrame((t) => {
        setRecordedDuration(t - recordingStartedAt.current);
      });
    }
  }, [isRecording, recordedDuration]);

  const copyToClipboard = async (url: string) => {
    await Clipboard.setStringAsync(url);
    Toast.show("URLをクリップボードにコピーしました", {
      duration: Toast.durations.SHORT,
    });
  };

  const uploadToGigafile = async (file: string) => {
    setIsUploading(true);

    const preserveDuration =
      (await AsyncStorage.getItem("preserveDuration")) ||
      DEFAULT_PRESERVE_DURATION;

    const task = FileSystem.createUploadTask(
      "https://46.gigafile.nu/upload_chunk.php",
      file,
      {
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "file",
        parameters: {
          id: uuid.v4(),
          name: "audio.mp3",
          chunk: "0",
          chunks: "1",
          lifetime: preserveDuration,
        },
      },
      (data) => {
        setUploadProgress(data.totalBytesSent / data.totalBytesExpectedToSend);
      }
    );
    const result = await task.uploadAsync();
    if (result) {
      const body = JSON.parse(result.body);
      setUploadedFileUrl(body.url);
      copyToClipboard(body.url);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "こえのポスト",
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable accessibilityLabel="設定画面を開く">
                <AntDesign name="setting" size={24} color="black" />
              </Pressable>
            </Link>
          ),
        }}
      />
      <View
        style={{
          flex: 1,
          paddingTop: 30,
          gap: 30,
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <RecordButtonIcon
          isRecording={isRecording}
          onStop={stopRecording}
          onStart={startRecording}
        />

        <Time time={recordedDuration} />

        <RecordButtonText
          isRecording={isRecording}
          onStop={stopRecording}
          onStart={startRecording}
        />

        {recordedFile ? (
          <>
            <Slider
              style={{ width: 200, height: 40 }}
              value={soundPosition}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              onValueChange={changePosition}
            />
            <Button
              title="戻す"
              accessibilityLabel="5秒前に戻す"
              onPress={rewind}
            />
            {isPlaying ? (
              <Button
                title="停止"
                accessibilityLabel="再生中の音源を停止する"
                onPress={async () => {
                  await pauseSound();
                  setIsPlaying(false);
                }}
              />
            ) : (
              <Button
                title="再生"
                accessibilityLabel="録音した音源を再生する"
                onPress={async () => {
                  setIsPlaying(true);
                  await playSound();
                }}
              />
            )}
            <Button
              title="進める"
              accessibilityLabel="5秒先に進める"
              onPress={forward}
            />
            <Button
              title="アップロード"
              accessibilityLabel="録音した音源をアップロードする"
              disabled={uploadedFileUrl !== null}
              onPress={() => {
                uploadToGigafile(recordedFile);
              }}
            />
          </>
        ) : null}

        {isUploading ? (
          <Progress.Circle size={30} progress={uploadProgress} />
        ) : null}

        {uploadedFileUrl ? (
          <Button
            title="コピー"
            accessibilityLabel="アップロードした音源をURLをコピーする"
            onPress={() => {
              copyToClipboard(uploadedFileUrl);
            }}
          />
        ) : null}
      </View>
    </>
  );
}
