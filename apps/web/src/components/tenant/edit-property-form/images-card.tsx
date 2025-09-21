"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import Image from "next/image";
import React from "react";

type ExistingPicture = { id: string; imageUrl: string; note?: string | null };

type Props = {
  existingPictures?: ExistingPicture[];
  onRemoveExisting: (id: string) => void;
  selectedImages: File[];
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  selectedImagePreviews: string[];
  onRemoveSelected: (index: number) => void;
  hiddenFileInput: React.RefObject<HTMLInputElement | null>;
};

export function ImagesCard({
  existingPictures,
  onRemoveExisting,
  selectedImages,
  setSelectedImages,
  selectedImagePreviews,
  onRemoveSelected,
  hiddenFileInput,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Property Images
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {existingPictures && existingPictures.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Current Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-64 overflow-y-auto py-1">
                {existingPictures.map((picture) => (
                  <div
                    key={picture.id}
                    className="relative w-full h-40 overflow-hidden rounded-md"
                  >
                    <Image
                      src={picture.imageUrl}
                      alt="Property"
                      width={320}
                      height={200}
                      className="w-full h-full object-cover rounded-md"
                    />

                    <button
                      type="button"
                      onClick={() => onRemoveExisting(picture.id)}
                      className="absolute top-2 right-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-sm text-red-600 hover:bg-white"
                      aria-label="Remove image"
                    >
                      ×
                    </button>

                    {picture.note && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {picture.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="images">Add New Images</Label>
            <input
              id="images-hidden"
              ref={hiddenFileInput}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setSelectedImages((prev) => [...prev, ...files]);
              }}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => hiddenFileInput.current?.click()}
              className="mt-1 w-full rounded-md border border-input px-3 py-2 text-left text-sm hover:bg-muted/50"
            >
              {selectedImages.length === 0 ? (
                <span className="text-muted-foreground">
                  Click to select images
                </span>
              ) : (
                <span>
                  {selectedImages
                    .slice(0, 3)
                    .map((f) => f.name)
                    .join(", ")}
                  {selectedImages.length > 3 && (
                    <span className="ml-2 text-muted-foreground">
                      +{selectedImages.length - 3} more
                    </span>
                  )}
                </span>
              )}
            </button>

            {selectedImages.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {selectedImages.length} new image(s) selected
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-64 overflow-y-auto py-1 mt-2">
                  {selectedImagePreviews.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative w-full h-40 overflow-hidden rounded-md"
                    >
                      <Image
                        src={src}
                        alt={`preview-${idx}`}
                        width={320}
                        height={200}
                        className="w-full h-full object-cover rounded-md"
                      />

                      <button
                        type="button"
                        onClick={() => onRemoveSelected(idx)}
                        className="absolute top-2 right-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-sm text-red-600 hover:bg-white"
                        aria-label="Remove selected image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
