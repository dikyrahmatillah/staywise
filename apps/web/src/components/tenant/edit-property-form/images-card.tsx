"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Camera, X } from "lucide-react";
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-1">
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
                      className="absolute top-2 right-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-sm text-red-600 hover:bg-white cursor-pointer"
                      aria-label="Remove image"
                    >
                      <X className="h-3 w-3" />
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

          <div className="my-4">
            <Separator />
          </div>

          <div className="space-y-4">
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

            <div className="mt-1 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => hiddenFileInput.current?.click()}
              >
                Choose Files
              </Button>

              <div className="text-sm text-muted-foreground">
                {selectedImages.length === 0 ? (
                  "No files selected"
                ) : (
                  <span title={selectedImages.map((f) => f.name).join(", ")}>
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
              </div>
            </div>

            {selectedImages.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {selectedImages.length} new image(s) selected
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-1 mt-2">
                  {selectedImagePreviews.map((src, idx) => (
                    <div
                      key={idx}
                      role="button"
                      tabIndex={0}
                      onClick={() => hiddenFileInput.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          hiddenFileInput.current?.click();
                      }}
                      className="relative w-full h-40 overflow-hidden rounded-md cursor-pointer"
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
                        onClick={(ev) => {
                          ev.stopPropagation();
                          onRemoveSelected(idx);
                        }}
                        className="absolute top-2 right-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-sm text-red-600 hover:bg-white cursor-pointer"
                        aria-label="Remove selected image"
                      >
                        <X className="h-3 w-3" />
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
