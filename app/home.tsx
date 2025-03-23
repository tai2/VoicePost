import React from "react";
import { useState, useRef, useLayoutEffect } from "react";
import { View, Text, Pressable, Alert, Modal } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Toast from "react-native-root-toast";
import Slider from "@react-native-community/slider";
import * as Clipboard from "expo-clipboard";
import { router, Stack } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { IconRecordButton } from "@/components/IconRecordButton";
import { TextRecordButton } from "@/components/TextRecordButton";
import { RewindButton } from "@/components/RewindButton";
import { FastForwardButton } from "@/components/FastForwardButton";
import { PlayButton } from "@/components/PlayButton";
import { PauseButton } from "@/components/PauseButton";
import { UploadButton } from "@/components/UploadButton";
import { CopyButton } from "@/components/CopyButton";
import { StorageSelector } from "@/components/StorageSelector";
import { getRecordedFilename } from "@/lib/getRecordedFilename";
import { useRecorder } from "@/hooks/useRecorder";
import { usePlayer } from "@/hooks/usePlayer";
import { useUploader } from "@/hooks/useUploader";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Borders } from "@/constants/Borders";
import { BoxShadow } from "@/constants/BoxShadow";
import { PlayTime } from "@/components/PlayTime";
import { delay } from "@/lib/delay";
import { catcher } from "@/lib/catcher";
import { collectError } from "@/lib/collectError";
import { Typography } from "@/constants/Typography";

const Home = () => {
  const uploarderViewHeightRatio = 0.95;

  const [showStorageSelector, setShowStorageSelector] = useState(false);
  const [storage, setStorage] = useState<"gigafile" | "dropbox" | undefined>(
    undefined
  );

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
    isProcessing,
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
    isSliding,
    onSlidingStart,
    onSliding,
    onSlidingStop,
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
      collectError("No recorded file");
      return;
    }

    const storage = await AsyncStorage.getItem("storage");
    if (!storage) {
      setShowStorageSelector(true);
      return;
    }

    if (storage !== "gigafile" && storage !== "dropbox") {
      throw `Invalid storage value: ${storage}`;
    }

    const result = await upload(recordedFile, uploadFilename, storage);
    if (result.status === "failed") {
      collectError("Failed to upload", result.error);
      Alert.alert("エラー", "アップロードに失敗しました");
      return;
    }

    if (result.status === "canceled") {
      return;
    }

    await delay(200);
    uploaderButtonPosition.value = -uploaderViewSize.width;
    await delay(400);
    await copyToClipboard(result.url);
  };

  const handleCopy = async () => {
    if (!uploadedFileUrl) {
      collectError("No uploaded file URL");
      return;
    }
    await copyToClipboard(uploadedFileUrl);
  };

  const handleStorageChange = async (value: string) => {
    if (value !== "gigafile" && value !== "dropbox") {
      throw `Invalid storage value: ${value}`;
    }

    await AsyncStorage.setItem("storage", value);

    setStorage(value);
    setShowStorageSelector(false);

    await handleUpload();
  };

  // react-native-root-toast requires the RootSiblingParent
  return (
    <RootSiblingParent>
      <Stack.Screen
        options={{
          title: "ボイスポスト",
          headerRight: () => (
            <Pressable
              accessibilityLabel="設定画面を開く"
              onPressIn={() => {
                // Workaround for expo/expo#33093 https://github.com/expo/expo/issues/33093
                // We should get back to the regular `Link` component when the issue is resolved
                router.navigate("/settings");
              }}
            >
              <AntDesign
                name="setting"
                size={Spacing[6]}
                hitSlop={Spacing[6]}
                color={Colors.zinc50}
              />
            </Pressable>
          ),
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showStorageSelector}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
          // setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={[
              {
                backgroundColor: Colors.zinc50,
                padding: Spacing[6],
                gap: Spacing[3],
              },
              Borders.roundedLg,
              BoxShadow.shadow2Xl,
            ]}
          >
            <Text style={[{ color: Colors.blue1InIcon }, Typography.textBase]}>
              保存先を選択してください
            </Text>
            <StorageSelector
              storage={storage}
              onPress={catcher(handleStorageChange)}
            />
          </View>
        </View>
      </Modal>
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
            isProcessing={isProcessing}
            onStop={catcher(handleOnStop)}
            onStart={catcher(handleOnStart)}
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
          isProcessing={isProcessing}
          onStop={catcher(handleOnStop)}
          onStart={catcher(handleOnStart)}
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
            value={isSliding ? undefined : soundPosition / recordedDuration}
            minimumTrackTintColor={Colors.orangeInIcon}
            maximumTrackTintColor={Colors.zinc300}
            onSlidingStart={onSlidingStart}
            onValueChange={onSliding}
            onSlidingComplete={onSlidingStop}
          />
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              gap: Spacing[2.5],
            }}
          >
            <RewindButton onPress={catcher(rewind)} />
            <View style={{ flexGrow: 1 }}>
              {isPlaying ? (
                <PauseButton onPress={catcher(pause)} />
              ) : (
                <PlayButton onPress={catcher(play)} />
              )}
            </View>
            <FastForwardButton onPress={catcher(forward)} />
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
                onPress={catcher(handleUpload)}
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
                onPress={catcher(handleCopy)}
              />
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </RootSiblingParent>
  );
};

export default Home;

const copyToClipboard = async (url: string) => {
  await Clipboard.setStringAsync(url);

  Toast.show("URLをクリップボードにコピーしました", {
    duration: Toast.durations.SHORT,
  });
};
