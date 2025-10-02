"use client";

import { useState, useRef } from "react";
import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  X,
  Camera,
  Sparkles,
} from "lucide-react";
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
    const max = 12;
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
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Camera className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Property Photos
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Showcase your property with high-quality images
            </p>
          </div>
          {pictures.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {pictures.length} photo{pictures.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
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
              {pictures.map(
                (
                  picture: { file?: File; note?: string; description?: string },
                  index: number
                ) => (
                  <div key={index} className="group relative">
                    <div className="aspect-video rounded-xl border-2 border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-300">
                      {picture.file ? (
                        <Image
                          src={URL.createObjectURL(picture.file)}
                          alt={picture.note || `Property photo ${index + 1}`}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                      {picture.file && (
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
                      {picture.note && (
                        <p className="text-sm text-gray-700 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
                          {picture.note}
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl w-8 h-8 rounded-full p-0"
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
        <div className="space-y-6 border-t border-gray-200 pt-8">
          <div className="flex items-center gap-2">
            <Label className="text-lg font-medium text-gray-900">
              Add New Photo
            </Label>
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </div>

          <div className="space-y-6">
            {!newPhoto.file ? (
              <div
                ref={dropRef}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dropRef.current?.classList.add(
                    "ring-2",
                    "ring-blue-400",
                    "ring-offset-2",
                    "bg-blue-50/50"
                  );
                }}
                onDragLeave={() =>
                  dropRef.current?.classList.remove(
                    "ring-2",
                    "ring-blue-400",
                    "ring-offset-2",
                    "bg-blue-50/50"
                  )
                }
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dropRef.current?.classList.remove(
                    "ring-2",
                    "ring-blue-400",
                    "ring-offset-2",
                    "bg-blue-50/50"
                  );
                  if (e.dataTransfer?.files?.length)
                    handleFiles(e.dataTransfer.files);
                }}
                className="relative border-2 border-dashed border-gray-300 rounded-xl p-12 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/30 bg-gradient-to-br from-gray-50/50 to-white"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Property Images
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Drag and drop your images here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Maximum file size: 1MB • Supported formats: JPG, PNG, WebP
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
                    className="shadow-lg hover:shadow-xl transition-all duration-200 border-2 hover:border-blue-400"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <div className="w-full max-w-md aspect-video border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
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
                    className="absolute top-3 right-3 h-8 w-8 rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={handleRemoveNewImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-4 py-3 border border-green-200">
                  <ImageIcon className="w-4 h-4" />
                  <span className="max-w-[220px] truncate font-medium">
                    {newPhoto.file.name}
                  </span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {(newPhoto.file.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label
                htmlFor="photoNote"
                className="text-sm font-medium text-gray-900"
              >
                Photo Description
                <span className="text-gray-500 font-normal ml-1">
                  (Optional)
                </span>
              </Label>
              <Input
                id="photoNote"
                value={newPhoto.note || ""}
                onChange={(e) =>
                  setNewPhoto((prev) => ({
                    ...prev,
                    note: e.target.value,
                  }))
                }
                placeholder="e.g., Living room, Master bedroom, Kitchen, Exterior view..."
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <Button
              type="button"
              onClick={handleAddPhoto}
              disabled={!newPhoto.file}
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add Photo to Gallery
            </Button>
          </div>
        </div>

        {pictures.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ImageIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No photos added yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start building your property gallery by adding your first photo
              above.
            </p>
            <p className="text-sm text-gray-500">
              High-quality photos help attract more guests to your property.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
