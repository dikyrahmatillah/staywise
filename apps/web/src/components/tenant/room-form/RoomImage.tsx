"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
interface Props {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  previewUrl: string;
  imageFile: File | null;
  isSubmitting: boolean;
  handleChooseFileClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  truncateFileName: (name: string) => string;
  errors: Record<string, string>;
}

export default function RoomImage({
  fileInputRef,
  previewUrl,
  imageFile,
  isSubmitting,
  handleChooseFileClick,
  handleFileChange,
  truncateFileName,
  errors,
}: Props) {
  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        id="imageFile"
        name="imageFile"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isSubmitting}
        className="hidden"
      />

      <div className="mt-2 flex items-center gap-2">
        <Button type="button" variant="outline" onClick={handleChooseFileClick} disabled={isSubmitting}>
          Choose File
        </Button>

        <div className="text-sm text-muted-foreground" title={imageFile ? imageFile.name : previewUrl ? "Current image" : "No file chosen"}>
          {imageFile ? truncateFileName(imageFile.name) : previewUrl ? "Current image" : "No file chosen"}
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        className={`mt-2 relative h-40 w-full rounded-md overflow-hidden border-2 border-dashed flex items-center justify-center cursor-pointer bg-muted/5`}
      >
        {previewUrl ? (
          <Image src={previewUrl} alt="Selected preview" fill sizes="(max-width: 640px) 100vw, 40rem" className="object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
            <div>Click an image here to upload</div>
            <div className="text-xs text-muted-foreground">PNG, JPG, GIF</div>
          </div>
        )}
      </div>

      {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl}</p>}
    </div>
  );
}
