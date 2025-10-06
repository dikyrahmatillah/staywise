"use client";

import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Image as ImageIcon, Camera } from "lucide-react";
import Image from "next/image";
import { ImageUploadArea } from "@/components/tenant/shared/image-upload-area";

type PictureItem =
  | string
  | {
      file?: File;
      note?: string;
      description?: string;
      preview?: string;
      imageUrl?: string;
    };

export function PhotosStep() {
  const { formData, updateFormData } = usePropertyCreation();

  const MAX_PHOTOS = 12;

  const pictures = formData.pictures || [];
  const existingPicturesFirst: PictureItem[] = pictures
    .slice()
    .filter(
      (p: PictureItem) =>
        typeof p === "string" ||
        (typeof p === "object" && !(p as Exclude<PictureItem, string>).file)
    )
    .concat(
      pictures
        .slice()
        .filter(
          (p: PictureItem) =>
            typeof p === "object" && (p as Exclude<PictureItem, string>).file
        )
    );

  const handleFilesSelected = (files: File[]) => {
    const valid: { file: File; note?: string; description?: string }[] = [];

    const remaining = Math.max(0, MAX_PHOTOS - pictures.length);
    if (remaining <= 0) return;

    const toAdd = Array.from(files).slice(0, remaining);
    toAdd.forEach((file) => {
      valid.push({ file, note: "", description: "" });
    });

    if (valid.length > 0) {
      updateFormData({ pictures: [...pictures, ...valid] });
    }
  };

  const handleRemovePhoto = (index: number) => {
    const photoToRemove = pictures[index] as PictureItem;

    if (typeof photoToRemove === "object" && photoToRemove.preview) {
      URL.revokeObjectURL(photoToRemove.preview);
    }

    const updatedPictures = pictures.filter(
      (_: PictureItem, i: number) => i !== index
    );
    updateFormData({ pictures: updatedPictures });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Property Photos
          </div>
          <Badge variant="secondary" className="text-xs">
            {pictures.length} photo{pictures.length !== 1 ? "s" : ""}
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-500">
          Showcase your property with high-quality images
        </p>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <ImageUploadArea
          onFilesSelected={handleFilesSelected}
          accept=".jpg,.jpeg,.png"
          maxSizeMB={1}
          allowedFormats={["jpg", "jpeg", "png"]}
          showEmptyState={pictures.length === 0}
        />

        {pictures.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Label className="text-lg font-medium text-gray-900">
                Added Photos
              </Label>
              <Badge variant="outline" className="text-xs">
                {pictures.length}/12
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {existingPicturesFirst.map(
                (picture: PictureItem, idx: number) => {
                  const originalIndex = pictures.indexOf(picture);
                  const key =
                    originalIndex !== -1 ? originalIndex : `new-${idx}`;

                  return (
                    <div key={key} className="group relative">
                      <div className="aspect-video rounded-xl border-2 border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/40">
                        {typeof picture === "object" && picture.file ? (
                          <Image
                            src={URL.createObjectURL(picture.file)}
                            alt={
                              picture.note ||
                              `Property photo ${originalIndex + 1}`
                            }
                            width={400}
                            height={225}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : typeof picture === "string" ? (
                          <Image
                            src={picture}
                            alt={`Property photo ${originalIndex + 1}`}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-60" />
                              <p className="text-sm font-medium">No preview</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 space-y-2">
                        {typeof picture === "object" && picture.file && (
                          <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                            <ImageIcon className="w-3 h-3" />
                            <span className="max-w-[120px] truncate text-xs">
                              {picture.file.name}
                            </span>
                            <Badge
                              variant="secondary"
                              className="text-xs ml-auto"
                            >
                              {(picture.file.size / 1024).toFixed(1)} KB
                            </Badge>
                          </div>
                        )}
                        {typeof picture === "object" && picture.note && (
                          <p className="text-sm text-gray-700 bg-primary/10 rounded-lg px-3 py-2 border border-primary/20">
                            {picture.note}
                          </p>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl w-8 h-8 rounded-full p-0 z-10"
                        onClick={() =>
                          handleRemovePhoto(
                            originalIndex !== -1 ? originalIndex : idx
                          )
                        }
                        aria-label="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
