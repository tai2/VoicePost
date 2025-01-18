import React from "react";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Toast from "react-native-root-toast";
import Slider from "@react-native-community/slider";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import uuid from "react-native-uuid";
import { Link, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootSiblingParent } from "react-native-root-siblings";
import AntDesign from "@expo/vector-icons/AntDesign";

import { Config } from "@/constants/Config";
import { RecordButtonIcon } from "@/components/RecordButtonIcon";
import { RecordButtonText } from "@/components/RecordButtonText";
import { Time } from "@/components/Time";
import { RewindButton } from "@/components/RewindButton";
import { FastForwardButton } from "@/components/FastForwardButton";
import { PlayButton } from "@/components/PlayButton";
import { PauseButton } from "@/components/PauseButton";
import { UploadButton } from "@/components/UploadButton";
import { CopyButton } from "@/components/CopyButton";
import { getRecordedFilename } from "@/lib/getRecordedFilename";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Spacing } from "@/constants/Spacing";
import { TimeText } from "@/components/TimeText";

export default function Index() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const recordingStartedAt = useRef<number>(0);
  const [recordedDuration, setRecordedDuration] = useState<number>(0);
  const [recordedFile, setRecordedFile] = useState<string | null>(null);
  const [recordedFilename, setRecordedFilename] = useState<string>("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [rootWidth, setRootWidth] = useState<number>(0);

  const rootRef = useRef<View>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [soundPosition, setSoundPosition] = useState<number>(0);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  useLayoutEffect(() => {
    rootRef.current?.measure((x_, y_, width, height_) => {
      setRootWidth(width);
    });
  }, [setRootWidth]);

  useEffect(() => {
    if (isRecording) {
      requestAnimationFrame((t) => {
        setRecordedDuration(t - recordingStartedAt.current);
      });
    }
  }, [isRecording, recordedDuration]);

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
      setRecordedFile(null);
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

        if (status.durationMillis) {
          setRecordedDuration(status.durationMillis);
          if (status.isPlaying) {
            setSoundPosition(status.positionMillis);
          }
        }
      }
    );
    soundRef.current = sound;

    setIsRecording(false);
    setSoundPosition(0);
    setRecordedFile(uri);
    setRecordedFilename(getRecordedFilename());
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

    const positionMillis = status.positionMillis + Config.skipDuration;
    sound.setStatusAsync({
      positionMillis,
    });
    setSoundPosition(Math.min(status.durationMillis, positionMillis));
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

    const positionMillis = status.positionMillis - Config.skipDuration;
    sound.setStatusAsync({
      positionMillis,
    });
    setSoundPosition(Math.max(0, positionMillis));
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
      Config.defaultPreserveDuration;

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
      await copyToClipboard(body.url);
    }
  };

  // react-native-root-toast requires the RootSiblingParent
  return (
    <RootSiblingParent>
      <Stack.Screen
        options={{
          title: "こえのポスト",
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable accessibilityLabel="設定画面を開く">
                <AntDesign
                  name="setting"
                  size={Spacing[6]}
                  color={Colors.zinc950}
                />
              </Pressable>
            </Link>
          ),
        }}
      />
      <View
        ref={rootRef}
        style={{
          flex: 1,
          paddingTop: Spacing[7],
          paddingBottom: Spacing[7],
          gap: Spacing[6],
          alignItems: "center",
          backgroundColor: Colors.zinc50,
        }}
      >
        <View style={{ flex: 1 }}>
          <RecordButtonIcon
            height="100%"
            isRecording={isRecording}
            onStop={stopRecording}
            onStart={startRecording}
          />
        </View>

        {recordedFile ? (
          <View style={{ flexDirection: "row", gap: Spacing[1.5] }}>
            <Time time={soundPosition} />
            <TimeText>/</TimeText>
            <Time time={recordedDuration} />
          </View>
        ) : (
          <Time time={recordedDuration} />
        )}

        <RecordButtonText
          isRecording={isRecording}
          onStop={stopRecording}
          onStart={startRecording}
        />

        <View
          style={{
            opacity: recordedFile ? 1 : 0,
            gap: Spacing[5],
            alignItems: "center",
          }}
        >
          <Text style={{ color: Colors.zinc500 }}>
            ファイル名: {recordedFilename}
          </Text>
          <Slider
            style={{ width: rootWidth - Spacing[10], height: Spacing[10] }}
            value={soundPosition / recordedDuration}
            minimumTrackTintColor={Colors.zinc50}
            maximumTrackTintColor={Colors.zinc950}
            onValueChange={changePosition}
          />
          <View style={{ flexDirection: "row", gap: Spacing[2.5] }}>
            <RewindButton onPress={rewind} />
            {isPlaying ? (
              <PauseButton
                onPress={async () => {
                  await pauseSound();
                  setIsPlaying(false);
                }}
              />
            ) : (
              <PlayButton
                onPress={async () => {
                  setIsPlaying(true);
                  await playSound();
                }}
              />
            )}
            <FastForwardButton onPress={forward} />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: Spacing[2.5],
            }}
          >
            <UploadButton
              disabled={uploadedFileUrl !== null}
              isUploading={isUploading}
              progress={uploadProgress}
              onPress={() => {
                if (!recordedFile) {
                  console.error("No recorded file");
                  return;
                }
                uploadToGigafile(recordedFile);
              }}
            />
            <CopyButton
              disabled={uploadedFileUrl === null}
              onPress={() => {
                if (!uploadedFileUrl) {
                  console.error("No uploaded file URL");
                  return;
                }
                copyToClipboard(uploadedFileUrl);
              }}
            />
          </View>
        </View>
      </View>
    </RootSiblingParent>
  );
}
