"use client";

import { useRef } from "react";
import { Upload, Camera } from "lucide-react";
import { toast } from "sonner";

type Props = {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxSizeMB?: number;
  allowedFormats?: string[];
  showEmptyState?: boolean;
  multiple?: boolean;
};

export function ImageUploadArea({
  onFilesSelected,
  accept = ".jpg,.jpeg,.png",
  maxSizeMB = 1,
  allowedFormats = ["jpg", "jpeg", "png"],
  showEmptyState = false,
  multiple = true,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const validateAndHandleFiles = (files: FileList | File[]) => {
    const valid: File[] = [];
    const allowedMimes = ["image/jpeg", "image/png"];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    Array.from(files).forEach((file) => {
      const name = file.name || "file";
      const ext = name.split(".").pop()?.toLowerCase() || "";
      const mimeOk = allowedMimes.includes(file.type);
      const extOk = allowedFormats.includes(ext);

      if (!mimeOk && !extOk) {
        toast.error(
          `Unsupported format — only ${allowedFormats
            .join(", ")
            .toUpperCase()} allowed`
        );
        return;
      }

      if (file.size > maxSizeBytes) {
        toast.error(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      valid.push(file);
    });

    if (valid.length > 0) {
      if (!multiple) {
        // when multiple is false, only pass the first valid file
        onFilesSelected([valid[0]]);
      } else {
        onFilesSelected(valid);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    validateAndHandleFiles(files);
  };

  return (
    <>
      <div
        ref={dropRef}
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dropRef.current?.classList.add(
            "ring-2",
            "ring-primary/40",
            "ring-offset-2",
            "bg-primary/10"
          );
        }}
        onDragLeave={() =>
          dropRef.current?.classList.remove(
            "ring-2",
            "ring-primary/40",
            "ring-offset-2",
            "bg-primary/10"
          )
        }
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dropRef.current?.classList.remove(
            "ring-2",
            "ring-primary/40",
            "ring-offset-2",
            "bg-primary/10"
          );
          if (e.dataTransfer?.files?.length)
            validateAndHandleFiles(e.dataTransfer.files);
        }}
        className="relative border-2 border-dashed border-gray-300 rounded-xl p-12 text-center transition-all duration-200 hover:border-primary/40 bg-gradient-to-br from-gray-50/50 to-white cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-50/20 rounded-xl opacity-0 transition-opacity duration-300" />
        <div className="relative z-10">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Property Images
          </h3>
          <p className="text-gray-600 mb-2">
            Drag and drop your images here, or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Maximum file size: {maxSizeMB}MB • Supported formats:{" "}
            {allowedFormats.join(", ").toUpperCase()}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {showEmptyState && (
        <div className="group relative">
          <div className="rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center">
            <div className="text-center py-8">
              <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No images uploaded yet
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
