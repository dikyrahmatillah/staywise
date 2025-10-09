"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImagePreviewProps {
  file: File | null;
  previewUrl?: string | null;
  onRemove: () => void;
  title?: string;
  showRemoveButton?: boolean;
}

export function ImagePreview({ 
  file, 
  previewUrl: externalPreviewUrl,
  onRemove, 
  title = "Preview",
  showRemoveButton = true 
}: ImagePreviewProps) {
  const [preview, setPreview] = useState<string | null>(externalPreviewUrl || null);

  useEffect(() => {
    // If external preview URL is provided, use it
    if (externalPreviewUrl) {
      setPreview(externalPreviewUrl);
      return;
    }

    // Otherwise, create preview from file
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file, externalPreviewUrl]);

  if (!preview) {
    return null;
  }

  const fileName = file?.name || "Payment Proof";
  const fileSize = file?.size 
    ? `${(file.size / 1024 / 1024).toFixed(2)} MB` 
    : null;

  return (
    <div className="relative border rounded-lg overflow-hidden bg-white">
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div>
          <p className="text-sm font-medium">{title}</p>
          {fileSize && (
            <p className="text-xs text-muted-foreground">{fileName} ({fileSize})</p>
          )}
        </div>
        {showRemoveButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="relative aspect-video bg-gray-50">
        <Image
          src={preview}
          alt={title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}