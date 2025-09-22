"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { RoomFormErrors } from "./types";
import type { RefObject } from "react";

type Props = {
  isSubmitting: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  previewUrl: string;
  imageFile: File | null;
  onChooseFile: () => void;
  onPickImage: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  truncateFileName: (name: string) => string;
  errors: RoomFormErrors;
};

export function ImageField({
  isSubmitting,
  fileInputRef,
  previewUrl,
  imageFile,
  onChooseFile,
  onPickImage,
  onFileChange,
  truncateFileName,
  errors,
}: Props) {
  const MAX_FILE_SIZE = 1 * 1024 * 1024;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      onFileChange(e);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be 1MB or smaller");
      if (fileInputRef?.current) fileInputRef.current.value = "";
      return;
    }

    onFileChange(e);
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        id="imageFile"
        name="imageFile"
        type="file"
        accept=".png,.jpg,.jpeg"
        onChange={handleFileChange}
        disabled={isSubmitting}
        className="hidden"
      />

      <div className="mt-2 flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onChooseFile}
          disabled={isSubmitting}
        >
          Choose File
        </Button>

        <div
          className="text-sm text-muted-foreground"
          title={
            imageFile
              ? imageFile.name
              : previewUrl
              ? "Current image"
              : "No file chosen"
          }
        >
          {imageFile
            ? truncateFileName(imageFile.name)
            : previewUrl
            ? "Current image"
            : "No file chosen"}
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={onPickImage}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onPickImage();
        }}
        className={`mt-2 relative h-40 w-full rounded-md overflow-hidden border-2 border-dashed flex items-center justify-center cursor-pointer bg-muted/5`}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Selected preview"
            fill
            sizes="(max-width: 640px) 100vw, 40rem"
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
            <div>Click an image here to upload</div>
            <div className="text-xs text-muted-foreground">
              PNG, JPG — max 1MB
            </div>
          </div>
        )}
      </div>

      {errors.imageUrl && (
        <p className="text-sm text-red-500">{errors.imageUrl}</p>
      )}
    </div>
  );
}
