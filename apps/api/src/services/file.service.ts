import { cloudinary } from "../configs/cloudinary.config.js";
import fs from "node:fs/promises";

export class FileService {
  async uploadPictureFromBuffer(buffer: Buffer): Promise<string> {
    if (!buffer) throw new Error("No file buffer provided for upload");

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload failed"));
          resolve(result.secure_url);
        }
      );
      uploadStream.end(buffer);
    });
  }

  async uploadPicture(filePath: string) {
    if (!filePath) throw new Error("No file path provided for upload");
    try {
      const uploadResult = await cloudinary.uploader.upload(filePath);
      return uploadResult.secure_url;
    } finally {
      await fs.unlink(filePath);
    }
  }
}
