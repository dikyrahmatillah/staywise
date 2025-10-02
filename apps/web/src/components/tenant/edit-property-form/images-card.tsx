"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, X, Upload } from "lucide-react";
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
  existingPictures = [],
  onRemoveExisting,
  selectedImages,
  setSelectedImages,
  selectedImagePreviews,
  onRemoveSelected,
  hiddenFileInput,
}: Props) {
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newImages = files.filter((file) => file.type.startsWith("image/"));
    setSelectedImages((prev) => [...prev, ...newImages]);
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
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => hiddenFileInput.current?.click()}
            className="w-full max-w-sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload New Images
          </Button>
        </div>

        <input
          ref={hiddenFileInput}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
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

        {totalImages === 0 && (
          <div className="text-center py-8">
            <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No images uploaded yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
