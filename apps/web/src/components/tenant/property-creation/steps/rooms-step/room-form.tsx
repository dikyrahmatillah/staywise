"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, BedDouble } from "lucide-react";
import { RoomFormData } from "./types";
import { RoomBasicInfo } from "./room-basic-info";
import { ImageUploadArea } from "@/components/tenant/shared/image-upload-area";
import Image from "next/image";
import { Label } from "@/components/ui/label";

type RoomFormProps = {
  formData: RoomFormData;
  isEditing: boolean;
  isValid: boolean;
  onFieldChange: (field: string, value: string | number) => void;
  onImageSelect: (files: File[]) => void;
  onImageRemove: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  containerRef?: React.Ref<HTMLDivElement>;
};

export function RoomForm({
  formData,
  isEditing,
  isValid,
  onFieldChange,
  onImageSelect,
  onImageRemove,
  onSubmit,
  onCancel,
  containerRef,
}: RoomFormProps) {
  return (
    <Card>
      <CardHeader className="mb-6">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BedDouble className="w-5 h-5 text-primary" />
          {isEditing ? "Edit Room" : "Add New Room"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Add or update room details and images
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <RoomBasicInfo formData={formData} onFieldChange={onFieldChange} />

        <div className="space-y-4">
          <Label className="text-sm">
            Room Image <span className="text-gray-400">(Optional)</span>
          </Label>

          {!formData.imageFile ? (
            <ImageUploadArea
              onFilesSelected={onImageSelect}
              multiple={false}
              accept="image/*"
              maxSizeMB={1}
              allowedFormats={["jpg", "jpeg", "png"]}
              showEmptyState={false}
            />
          ) : (
            <div className="space-y-4">
              <div className="relative inline-block">
                <div className="w-full max-w-sm aspect-video border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
                  <Image
                    src={formData.imagePreview!}
                    alt="Room preview"
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-3 right-3 h-8 w-8 rounded-full p-0 shadow-lg"
                  onClick={onImageRemove}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div ref={containerRef} className="pt-4">
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onSubmit}
              disabled={!isValid}
              className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isEditing ? "Save changes" : "Add Room to Property"}
            </Button>

            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="h-12"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
