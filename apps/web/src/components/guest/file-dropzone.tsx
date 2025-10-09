"use client";

import type React from "react";

import { useCallback, useState, useRef } from "react";
import { FileImage, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileDropzone({
  onFileSelect,
  disabled = false,
  accept = "image/jpeg,image/jpg,image/png",
  maxSize = 1,
  className,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      const allowedTypes = accept.split(",").map((type) => type.trim());
      if (!allowedTypes.includes(file.type)) {
        return `Please upload a valid image file (${accept
          .replace(/image\//g, "")
          .toUpperCase()})`;
      }

      const maxBytes = maxSize * 1024 * 1024;
      if (file.size > maxBytes) {
        return `File size must be less than ${maxSize}MB`;
      }

      return null;
    },
    [accept, maxSize]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      setError(null);

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      onFileSelect(file);
    },
    [validateFile, onFileSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [disabled, handleFileSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
          {
            "border-gray-300 hover:border-gray-400":
              !isDragOver && !disabled && !error,
            "border-blue-400 bg-blue-50": isDragOver && !disabled,
            "border-red-400 bg-red-50": error,
            "border-gray-200 bg-gray-50 cursor-not-allowed": disabled,
          }
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-4">
          {error ? (
            <AlertCircle className="h-12 w-12 text-red-500" />
          ) : (
            <div
              className={cn(
                "transition-colors",
                isDragOver ? "bg-blue-100" : "bg-transparent"
              )}
            >
              {isDragOver ? (
                <FileImage className="h-6 w-6 text-blue-600" />
              ) : (
                <Image
                  src="/assets/upload.png"
                  alt="Upload Payment Proof"
                  width={64}
                  height={64}
                  className="h-16 w-16 object-contain"
                />
              )}
            </div>
          )}

          <div className="space-y-2">
            {error ? (
              <div className="text-red-600">
                <p className="font-medium">Upload Error</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragOver ? "Drop your image here" : "Upload payment proof"}
                </p>
                <p className="text-xs text-gray-500">
                  Drag and drop an image, or{" "}
                  <span className="text-blue-600 underline">browse files</span>
                </p>
              </div>
            )}
          </div>

          {!error && (
            <div className="text-xs text-gray-400 space-y-1">
              <p>Supports: JPEG, PNG</p>
              <p>Max file size: {maxSize}MB</p>
            </div>
          )}
        </div>

        {isDragOver && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="text-blue-700 font-medium">Drop to upload</div>
          </div>
        )}
      </div>

      {error && (
        <button
          onClick={() => setError(null)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
