"use client";

import { useState, useRef } from "react";
import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";

type PhotoFormData = {
  file?: File;
  note?: string;
  preview?: string;
};

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const [newPhoto, setNewPhoto] = useState<PhotoFormData>({
    note: "",
  });

  const pictures = formData.pictures || [];

  const handleFiles = (files: FileList | File[]) => {
    const valid: { file: File; note?: string; description?: string }[] = [];
    const max = 12; // guard against excessive uploads
    Array.from(files)
      .slice(0, max)
      .forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        if (file.size > 1024 * 1024) return;
        valid.push({ file, note: "", description: "" });
      });

    if (valid.length === 0) return;

    // If only one file and no current selection, show preview in the composer
    if (valid.length === 1 && !newPhoto.file) {
      const previewUrl = URL.createObjectURL(valid[0].file);
      setNewPhoto((prev) => ({
        ...prev,
        file: valid[0].file,
        preview: previewUrl,
      }));
      return;
    }

    // Otherwise append to pictures immediately
    updateFormData({ pictures: [...pictures, ...valid] });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    handleFiles(files);
  };

  const handleRemoveNewImage = () => {
    if (newPhoto.preview) {
      URL.revokeObjectURL(newPhoto.preview);
    }
    setNewPhoto({
      note: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddPhoto = () => {
    if (!newPhoto.file) {
      return;
    }

    const photoToAdd = {
      file: newPhoto.file,
      description: newPhoto.note?.trim() || undefined,
      note: newPhoto.note?.trim() || undefined,
    };

    updateFormData({
      pictures: [...pictures, photoToAdd],
    });

    if (newPhoto.preview) {
      URL.revokeObjectURL(newPhoto.preview);
    }

    setNewPhoto({
      note: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      <CardHeader>
        <CardTitle>Property Photos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {pictures.length > 0 && (
          <div className="space-y-4">
            <Label className="text-base font-medium">Added Photos:</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pictures.map(
                (
                  picture: { file?: File; note?: string; description?: string },
                  index: number
                ) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video rounded-lg border overflow-hidden bg-gray-100">
                      {picture.file ? (
                        <Image
                          src={URL.createObjectURL(picture.file)}
                          alt={picture.note || `Property photo ${index + 1}`}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-xs">No preview</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 space-y-1">
                      {picture.file && (
                        <p className="text-xs text-gray-600">
                          📷 {picture.file.name} (
                          {(picture.file.size / 1024).toFixed(1)} KB)
                        </p>
                      )}
                      {picture.note && (
                        <p className="text-xs text-gray-600">{picture.note}</p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Add New Photo Form */}
        <div className="space-y-4 border-t pt-6">
          <Label className="text-base font-medium">Add New Photo:</Label>

          <div className="space-y-4">
            {!newPhoto.file ? (
              <div
                ref={dropRef}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dropRef.current?.classList.add("ring-2", "ring-primary/30");
                }}
                onDragLeave={() =>
                  dropRef.current?.classList.remove("ring-2", "ring-primary/30")
                }
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dropRef.current?.classList.remove(
                    "ring-2",
                    "ring-primary/30"
                  );
                  if (e.dataTransfer?.files?.length)
                    handleFiles(e.dataTransfer.files);
                }}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">
                  Upload a property image (Max 1MB)
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supported formats: JPG, PNG, WebP
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <div className="w-full max-w-md aspect-video border rounded-lg overflow-hidden">
                    <Image
                      src={newPhoto.preview!}
                      alt="Photo preview"
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full p-0"
                    onClick={handleRemoveNewImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-green-600">
                  📷 {newPhoto.file.name} (
                  {(newPhoto.file.size / 1024).toFixed(1)} KB)
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="photoNote">Description (Optional)</Label>
              <Input
                id="photoNote"
                value={newPhoto.note || ""}
                onChange={(e) =>
                  setNewPhoto((prev) => ({
                    ...prev,
                    note: e.target.value,
                  }))
                }
                placeholder="e.g., Living room, Bedroom, Exterior view..."
              />
            </div>

            <Button
              type="button"
              onClick={handleAddPhoto}
              disabled={!newPhoto.file}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Photo
            </Button>
          </div>
        </div>

        {pictures.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No photos added yet. Add your first photo above.</p>
            <p className="text-sm mt-2">
              High-quality photos help attract more guests to your property.
            </p>
          </div>
        )}

        {pictures.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Photo Tips:</p>
                <ul className="mt-1 text-blue-800 space-y-1">
                  <li>• Add at least 5-10 photos for better visibility</li>
                  <li>• Include photos of bedrooms, bathrooms, common areas</li>
                  <li>• Use good lighting and high resolution</li>
                  <li>• Consider adding exterior and amenity photos</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
