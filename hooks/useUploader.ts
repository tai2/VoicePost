import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";
import { Config } from "@/constants/Config";

export const useUploader = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const reset = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadedFileUrl(null);
  };

  const upload = async (file: string, uploadedAs: string): Promise<string> => {
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
          name: uploadedAs,
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
    if (!result) {
      throw new Error("Failed to upload");
    }

    const url = JSON.parse(result.body).url;
    setUploadedFileUrl(url);

    return url;
  };

  return {
    isUploading,
    uploadProgress,
    uploadedFileUrl,
    reset,
    upload,
  };
};
