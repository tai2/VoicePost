import React from "react";
import { useState, useRef, useLayoutEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
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
import { useRecorder } from "@/hooks/useRecorder";
import { usePlayer } from "@/hooks/usePlayer";
import { useUploader } from "@/hooks/useUploader";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { TimeText } from "@/components/TimeText";
import { Config } from "@/constants/Config";
import { Borders } from "@/constants/Borders";

export default function Index() {
  const uploarderViewHeightRatio = 0.95;

  const [uploadFilename, setUploadFilename] = useState<string>("");
  const [uploaderViewSize, setUploaderViewSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const uploaderViewRef = useRef<View>(null);
  const uploaderViewPosition = useSharedValue(0);

  useLayoutEffect(() => {
    uploaderViewRef.current?.measure((x_, y_, width, height) => {
      setUploaderViewSize({ width, height: height });
      uploaderViewPosition.value = height * uploarderViewHeightRatio;
    });
  }, [setUploaderViewSize]);

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
    soundDuration,
    load,
    play,
    pause,
    forward,
    rewind,
    changePosition,
  } = usePlayer();

  const { isUploading, uploadProgress, uploadedFileUrl, reset, upload } =
    useUploader();

  const springConfig = {
    mass: 0.9,
    stiffness: 150,
  };
  const handleOnStart = async () => {
    uploaderViewPosition.value = withSpring(
      uploaderViewSize.height * uploarderViewHeightRatio,
      springConfig
    );
    reset();
    await startRecording();
  };

  const handleOnStop = async () => {
    uploaderViewPosition.value = withSpring(0, springConfig);
    const uri = await stopRecording();
    await load(uri, recordedDuration);
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
          title: "ボイスポスト",
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
          paddingTop: Spacing[5],
          gap: Spacing[5],
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
            <Time time={soundDuration} />
          </View>
        ) : (
          <Time time={recordedDuration} />
        )}

        <TextRecordButton
          isRecording={isRecording}
          onStop={handleOnStop}
          onStart={handleOnStart}
        />

        <Animated.View
          ref={uploaderViewRef}
          style={[
            {
              gap: Spacing[5],
              width: "100%",
              padding: Spacing[6],
              backgroundColor: Colors.zinc100,
              alignItems: "center",
              shadowRadius: 10,
              shadowColor: "black",
              shadowOpacity: 0.2,
              transform: [{ translateY: uploaderViewPosition }],
            },
            Borders.roundedLg,
          ]}
        >
          <Text style={{ color: Colors.zinc500 }}>
            ファイル名: {uploadFilename}
          </Text>
          <Slider
            style={{
              width: uploaderViewSize.width - Spacing[6] * 2,
              height: Spacing[10],
            }}
            value={soundPosition / recordedDuration}
            minimumTrackTintColor={Colors.zinc950}
            maximumTrackTintColor={Colors.zinc300}
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
        </Animated.View>
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
