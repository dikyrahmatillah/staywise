"use client";

import { useState } from "react";
import { usePropertyCreation } from "../property-creation-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Image as ImageIcon, ExternalLink } from "lucide-react";
import Image from "next/image";
import { CreatePropertyPictureInput } from "@repo/schemas";

export function PhotosStep() {
  const { formData, updateFormData } = usePropertyCreation();
  const [newPhoto, setNewPhoto] = useState<CreatePropertyPictureInput>({
    imageUrl: "",
    note: "",
  });

  const pictures = formData.pictures || [];

  const handleAddPhoto = () => {
    if (!newPhoto.imageUrl.trim()) {
      return;
    }

    const photoToAdd: CreatePropertyPictureInput = {
      imageUrl: newPhoto.imageUrl.trim(),
      note: newPhoto.note?.trim() || undefined,
    };

    updateFormData({
      pictures: [...pictures, photoToAdd],
    });

    // Reset form
    setNewPhoto({ imageUrl: "", note: "" });
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPictures = pictures.filter(
      (_: CreatePropertyPictureInput, i: number) => i !== index
    );
    updateFormData({ pictures: updatedPictures });
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Photos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Photos */}
        {pictures.length > 0 && (
          <div className="space-y-4">
            <Label className="text-base font-medium">Added Photos:</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pictures.map(
                (picture: CreatePropertyPictureInput, index: number) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video rounded-lg border overflow-hidden bg-gray-100">
                      {isValidUrl(picture.imageUrl) ? (
                        <Image
                          src={picture.imageUrl}
                          alt={picture.note || `Property photo ${index + 1}`}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.parentElement!.classList.add(
                              "flex",
                              "items-center",
                              "justify-center"
                            );
                            target.parentElement!.innerHTML = `
                            <div class="text-center text-gray-500">
                              <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <p class="text-xs">Failed to load</p>
                            </div>
                          `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-xs">Invalid URL</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                        <a
                          href={picture.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline truncate"
                        >
                          {picture.imageUrl}
                        </a>
                      </div>
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
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL *</Label>
              <Input
                id="imageUrl"
                type="url"
                value={newPhoto.imageUrl}
                onChange={(e) =>
                  setNewPhoto((prev: CreatePropertyPictureInput) => ({
                    ...prev,
                    imageUrl: e.target.value,
                  }))
                }
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-500">
                Enter a direct link to your image. Supported formats: JPG, PNG,
                WebP
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoNote">Description (Optional)</Label>
              <Input
                id="photoNote"
                value={newPhoto.note || ""}
                onChange={(e) =>
                  setNewPhoto((prev: CreatePropertyPictureInput) => ({
                    ...prev,
                    note: e.target.value,
                  }))
                }
                placeholder="e.g., Living room, Bedroom, Exterior view..."
              />
            </div>

            {/* Preview */}
            {newPhoto.imageUrl && isValidUrl(newPhoto.imageUrl) && (
              <div className="space-y-2">
                <Label>Preview:</Label>
                <div className="aspect-video w-full max-w-md rounded-lg border overflow-hidden bg-gray-100">
                  <Image
                    src={newPhoto.imageUrl}
                    alt="Preview"
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement!.classList.add(
                        "flex",
                        "items-center",
                        "justify-center"
                      );
                      target.parentElement!.innerHTML = `
                        <div class="text-center text-gray-500">
                          <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p class="text-xs">Failed to load image</p>
                        </div>
                      `;
                    }}
                  />
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={handleAddPhoto}
              disabled={
                !newPhoto.imageUrl.trim() || !isValidUrl(newPhoto.imageUrl)
              }
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
