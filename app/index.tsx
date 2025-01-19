import React from "react";
import { useState, useRef, useLayoutEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Toast from "react-native-root-toast";
import Slider from "@react-native-community/slider";
import * as Clipboard from "expo-clipboard";
import { Link, Stack } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
import AntDesign from "@expo/vector-icons/AntDesign";

import { IconRecordButton } from "@/components/IconRecordButton";
import { TextRecordButton } from "@/components/TextRecordButton";
import { Time } from "@/components/Time";
import { RewindButton } from "@/components/RewindButton";
import { FastForwardButton } from "@/components/FastForwardButton";
import { PlayButton } from "@/components/PlayButton";
import { PauseButton } from "@/components/PauseButton";
import { UploadButton } from "@/components/UploadButton";
import { CopyButton } from "@/components/CopyButton";
import { getRecordedFilename } from "@/lib/getRecordedFilename";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { TimeText } from "@/components/TimeText";
import { useRecorder } from "@/hooks/useRecorder";
import { usePlayer } from "@/hooks/usePlayer";
import { useUploader } from "@/hooks/useUploader";

export default function Index() {
  const [uploadFilename, setUploadFilename] = useState<string>("");
  const [uploaderViewWidth, setUploaderViewWidth] = useState<number>(0);

  const uploaderViewRef = useRef<View>(null);

  useLayoutEffect(() => {
    uploaderViewRef.current?.measure((x_, y_, width, height_) => {
      setUploaderViewWidth(width);
    });
  }, [setUploaderViewWidth]);

  const {
    isRecording,
    recordedDuration,
    recordedFile,
    startRecording,
    stopRecording,
  } = useRecorder();

  const {
    isPlaying,
    soundPosition,
    load,
    play,
    pause,
    forward,
    rewind,
    changePosition,
  } = usePlayer();

  const { isUploading, uploadProgress, uploadedFileUrl, reset, upload } =
    useUploader();

  const handleOnStart = async () => {
    reset();

    await startRecording();
  };

  const handleOnStop = async () => {
    const uri = await stopRecording();
    await load(uri);
    setUploadFilename(getRecordedFilename());
  };

  const handleUpload = async () => {
    if (!recordedFile) {
      console.error("No recorded file");
      return;
    }
    const url = await upload(recordedFile, uploadFilename);
    await copyToClipboard(url);
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
          <IconRecordButton
            height="100%"
            isRecording={isRecording}
            onStop={handleOnStop}
            onStart={handleOnStart}
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

        <TextRecordButton
          isRecording={isRecording}
          onStop={handleOnStop}
          onStart={handleOnStart}
        />

        <View
          ref={uploaderViewRef}
          style={{
            opacity: recordedFile ? 1 : 0,
            gap: Spacing[5],
            alignItems: "center",
          }}
        >
          <Text style={{ color: Colors.zinc500 }}>
            ファイル名: {uploadFilename}
          </Text>
          <Slider
            style={{ width: uploaderViewWidth, height: Spacing[10] }}
            value={soundPosition / recordedDuration}
            minimumTrackTintColor={Colors.zinc50}
            maximumTrackTintColor={Colors.zinc950}
            onValueChange={changePosition}
          />
          <View style={{ flexDirection: "row", gap: Spacing[2.5] }}>
            <RewindButton onPress={rewind} />
            {isPlaying ? (
              <PauseButton onPress={pause} />
            ) : (
              <PlayButton onPress={play} />
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
              onPress={handleUpload}
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

const copyToClipboard = async (url: string) => {
  await Clipboard.setStringAsync(url);

  Toast.show("URLをクリップボードにコピーしました", {
    duration: Toast.durations.SHORT,
  });
};
