import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import * as Sentry from "@sentry/react-native";

export const upload = async (
  fileUri: string,
  uploadedAs: string,
  lifetime: string,
  callback: (data: FileSystem.UploadProgressData) => void
): Promise<{ url: string } | null> => {
  const task = FileSystem.createUploadTask(
    "https://46.gigafile.nu/upload_chunk.php",
    fileUri,
    {
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "file",
      parameters: {
        id: Crypto.randomUUID(),
        name: uploadedAs,
        chunk: "0",
        chunks: "1",
        lifetime,
      },
    },
    callback
  );

  const result = await task.uploadAsync();
  if (!result) {
    return null;
  }

  try {
    return JSON.parse(result.body);
  } catch {
    Sentry.captureMessage(`Invalid response from gigafile.nu: ${result.body}`);
    return null;
  }
};
