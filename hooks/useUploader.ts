import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Config } from "@/constants/Config";
import { upload as uploadToGigafile } from "@/lib/gigafile/upload";
import { upload as uploadToDropbox } from "@/lib/dropbox/upload";
import { createSharedLinkWithSettings } from "@/lib/dropbox/createSharedLinkWithSettings";

import { useDropboxOAuth } from "./useDropboxOAuth";

export type UploadResult =
  | {
      status: "succeeded";
      url: string;
    }
  | {
      status: "canceled";
    }
  | {
      status: "failed";
      error: any;
    };

export const useUploader = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const { issueAccessToken } = useDropboxOAuth("home");

  const reset = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadedFileUrl(null);
  };

  const gigafileUploadFlow = async (
    fileUri: string,
    uploadedAs: string
  ): Promise<UploadResult> => {
    setIsUploading(true);

    const preserveDuration =
      (await AsyncStorage.getItem("preserveDuration")) ||
      Config.defaultPreserveDuration;

    const result = await uploadToGigafile(
      fileUri,
      uploadedAs,
      preserveDuration,
      (data) => {
        setUploadProgress(data.totalBytesSent / data.totalBytesExpectedToSend);
      }
    );
    if (!result) {
      return { status: "failed", error: "Failed to upload" };
    }

    return {
      status: "succeeded",
      url: result.url,
    };
  };

  const dropboxUploadFlow = async (
    fileUri: string,
    uploadedAs: string
  ): Promise<UploadResult> => {
    try {
      const tokenResponse = await issueAccessToken();
      if (!tokenResponse) {
        return { status: "canceled" };
      }

      // TODO: Cache the token

      setIsUploading(true);

      const remotePath = `/${uploadedAs}`;

      const uploadResult = await uploadToDropbox(
        fileUri,
        remotePath,
        tokenResponse.accessToken,
        (data) => {
          setUploadProgress(
            data.totalBytesSent / data.totalBytesExpectedToSend
          );
        }
      );
      if (!uploadResult) {
        return { status: "failed", error: "Failed to upload" };
      }

      const shareResult = await createSharedLinkWithSettings(
        remotePath,
        tokenResponse.accessToken
      );

      return {
        status: "succeeded",
        url: shareResult.url,
      };
    } catch (error) {
      return { status: "failed", error };
    }
  };

  const upload = async (
    file: string,
    uploadedAs: string,
    storage: "gigafile" | "dropbox"
  ): Promise<UploadResult> => {
    const result =
      storage === "gigafile"
        ? await gigafileUploadFlow(file, uploadedAs)
        : await dropboxUploadFlow(file, uploadedAs);

    if (result.status === "succeeded") {
      setUploadedFileUrl(result.url);
    }

    return result;
  };

  return {
    isUploading,
    uploadProgress,
    uploadedFileUrl,
    reset,
    upload,
  };
};
