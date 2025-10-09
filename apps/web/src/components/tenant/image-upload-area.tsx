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
        className="group relative border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-12 text-center sm:text-left transition-all duration-200 hover:border-primary/40 bg-gradient-to-br from-gray-50/50 to-white cursor-pointer"
      >
        <div className="relative z-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>

            <div className="max-w-xl">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                Upload Property Images
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Drag and drop your images here, or click to browse
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                Maximum file size: {maxSizeMB}MB • Supported formats:{" "}
                {allowedFormats.join(", ").toUpperCase()}
              </p>
            </div>
          </div>

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
