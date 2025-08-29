import { cloudinary } from "@/configs/cloudinary.config.js";
import fs from "node:fs/promises";

export class FileService {
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
