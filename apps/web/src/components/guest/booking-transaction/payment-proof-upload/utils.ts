import type { 
  FileValidationOptions, 
  FileValidationResult,
  PaymentProofFile 
} from "./types";

const DEFAULT_MAX_SIZE_MB = 1;
const DEFAULT_ACCEPTED_FORMATS = ["image/jpeg", "image/jpg", "image/png"];

export function validateFile(
  file: File,
  options: Partial<FileValidationOptions> = {}
): FileValidationResult {
  const maxSizeMB = options.maxSizeMB ?? DEFAULT_MAX_SIZE_MB;
  const acceptedFormats = options.acceptedFormats ?? DEFAULT_ACCEPTED_FORMATS;

  if (!acceptedFormats.includes(file.type)) {
    const formats = acceptedFormats
      .map((type) => type.replace("image/", "").toUpperCase())
      .join(", ");
    return {
      isValid: false,
      error: `Please upload a valid image file (${formats})`,
    };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  return { isValid: true };
}

export function createFilePreview(file: File): PaymentProofFile {
  const preview = URL.createObjectURL(file);
  return {
    file,
    preview,
    uploadedAt: new Date(),
  };
}

export function revokeFilePreview(preview: string): void {
  try {
    URL.revokeObjectURL(preview);
  } catch (error) {
    console.warn("Failed to revoke object URL:", error);
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2).toUpperCase();
}