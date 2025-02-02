import React from "react";
import { useState, useRef, useLayoutEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Toast from "react-native-root-toast";
import Slider from "@react-native-community/slider";
import * as Clipboard from "expo-clipboard";
import { Link, Stack } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
import AntDesign from "@expo/vector-icons/AntDesign";

import { IconRecordButton } from "@/components/IconRecordButton";
import { TextRecordButton } from "@/components/TextRecordButton";
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
import { Borders } from "@/constants/Borders";
import { BoxShadow } from "@/constants/BoxShadow";
import { PlayTime } from "@/components/PlayTime";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Index() {
  const uploarderViewHeightRatio = 0.95;

  const [uploadFilename, setUploadFilename] = useState<string>("");
  const [uploaderViewSize, setUploaderViewSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const uploaderViewRef = useRef<View>(null);
  const uploaderViewPosition = useSharedValue(0);
  const uploaderButtonPosition = useSharedValue(0);

  useLayoutEffect(() => {
    uploaderViewRef.current?.measure((x_, y_, width, height) => {
      setUploaderViewSize({ width, height: height });
      uploaderViewPosition.value = height * uploarderViewHeightRatio;
      uploaderButtonPosition.value = 0;
    });
  }, [setUploaderViewSize, uploaderViewPosition, uploaderButtonPosition]);

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

  const uploadButtonAnimation = useAnimatedStyle(() => ({
    left: withSpring(uploaderButtonPosition.value),
  }));

  const copyButtonAnimattion = useAnimatedStyle(() => ({
    left: withSpring(uploaderViewSize.width + uploaderButtonPosition.value),
  }));

  const springConfig = {
    mass: 0.9,
    stiffness: 150,
  };
  const handleOnStart = async () => {
    uploaderViewPosition.value = withSpring(
      uploaderViewSize.height * uploarderViewHeightRatio,
      springConfig
    );
    uploaderButtonPosition.value = 0;
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
    await delay(200);
    uploaderButtonPosition.value = -uploaderViewSize.width;
    await delay(400);
    await copyToClipboard(url);
  };

  const handleCopy = async () => {
    if (!uploadedFileUrl) {
      console.error("No uploaded file URL");
      return;
    }
    await copyToClipboard(uploadedFileUrl);
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
                  color={Colors.zinc50}
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
          backgroundColor: Colors.blue1InIcon,
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

        <PlayTime
          time={
            recordedFile
              ? {
                  mode: "player",
                  position: soundPosition,
                  duration: soundDuration,
                }
              : { mode: "recorder", duration: recordedDuration }
          }
        />

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
              width: "102%",
              padding: Spacing[6],
              backgroundColor: Colors.blue1InIcon,
              alignItems: "center",
              transform: [{ translateY: uploaderViewPosition }],
              borderColor: "rgba(0, 0, 0, 0.5)",
            },
            BoxShadow.shadow2Xl,
            Borders.roundedT3Xl,
            Borders.border,
          ]}
        >
          <Text testID="upload_file_name" style={{ color: Colors.zinc50 }}>
            ファイル名: {uploadFilename}
          </Text>
          <Slider
            style={{
              width: uploaderViewSize.width - Spacing[6] * 2,
              height: Spacing[10],
            }}
            value={soundPosition / recordedDuration}
            minimumTrackTintColor={Colors.orangeInIcon}
            maximumTrackTintColor={Colors.zinc300}
            onValueChange={changePosition}
          />
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              gap: Spacing[2.5],
            }}
          >
            <RewindButton onPress={rewind} />
            <View style={{ flexGrow: 1 }}>
              {isPlaying ? (
                <PauseButton onPress={pause} />
              ) : (
                <PlayButton onPress={play} />
              )}
            </View>
            <FastForwardButton onPress={forward} />
          </View>
          <View
            style={{
              width: "100%",
              height: Spacing[12],
            }}
          >
            <Animated.View
              style={[
                {
                  position: "absolute",
                  width: "100%",
                },
                uploadButtonAnimation,
              ]}
            >
              <UploadButton
                disabled={uploadedFileUrl !== null}
                isUploading={isUploading}
                progress={uploadProgress}
                onPress={handleUpload}
              />
            </Animated.View>
            <Animated.View
              style={[
                { position: "absolute", width: "100%" },
                copyButtonAnimattion,
              ]}
            >
              <CopyButton
                disabled={uploadedFileUrl === null}
                onPress={handleCopy}
              />
            </Animated.View>
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
