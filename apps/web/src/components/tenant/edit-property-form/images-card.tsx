"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { ImageUploadArea } from "@/components/tenant/shared/image-upload-area";

type ExistingPicture = { id: string; imageUrl: string; note?: string | null };

type Props = {
  existingPictures?: ExistingPicture[];
  onRemoveExisting: (id: string) => void;
  selectedImages: File[];
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  selectedImagePreviews: string[];
  onRemoveSelected: (index: number) => void;
};

export function ImagesCard({
  existingPictures = [],
  onRemoveExisting,
  selectedImages,
  setSelectedImages,
  selectedImagePreviews,
  onRemoveSelected,
}: Props) {
  const handleFilesSelected = (files: File[]) => {
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const totalImages = existingPictures.length + selectedImages.length;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Property Images
          </div>
          <Badge variant="secondary" className="text-xs">
            {totalImages} images
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload high-quality images to showcase your property
        </p>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <ImageUploadArea
          onFilesSelected={handleFilesSelected}
          accept="image/*"
          maxSizeMB={1}
          allowedFormats={["jpg", "jpeg", "png"]}
          showEmptyState={totalImages === 0}
        />

        {existingPictures.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Current Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingPictures.map((picture, index) => (
                <div
                  key={picture.id}
                  className="relative group w-full h-40 overflow-hidden rounded-lg border"
                >
                  <Image
                    src={picture.imageUrl}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2 text-xs">
                      Main
                    </Badge>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveExisting(picture.id)}
                    className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedImages.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">New Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedImagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative group w-full h-40 overflow-hidden rounded-lg border"
                >
                  <Image
                    src={preview}
                    alt={`New image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveSelected(index)}
                    className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
