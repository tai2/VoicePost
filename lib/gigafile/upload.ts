import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";

export const upload = async (
  localPath: string,
  uploadPath: string,
  lifetime: string,
  callback: (data: FileSystem.UploadProgressData) => void
) => {
  const task = FileSystem.createUploadTask(
    "https://46.gigafile.nu/upload_chunk.php",
    localPath,
    {
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "file",
      parameters: {
        id: Crypto.randomUUID(),
        name: uploadPath,
        chunk: "0",
        chunks: "1",
        lifetime,
      },
    },
    callback
  );
  return await task.uploadAsync();
};
