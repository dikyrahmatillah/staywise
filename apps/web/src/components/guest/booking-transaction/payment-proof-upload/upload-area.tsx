"use client";

import { useCallback, useState, useRef } from "react";
import { FileImage, AlertCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePaymentProof } from "./payment-proof-context";

export function UploadArea() {
  const { state, actions, validationOptions } = usePaymentProof();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

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

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        actions.onFileSelect(files[0]);
      }
    },
    [actions]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        actions.onFileSelect(files[0]);
      }
      e.target.value = "";
    },
    [actions]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const acceptString = validationOptions.acceptedFormats.join(",");

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
          {
            "border-gray-300 hover:border-gray-400":
              !isDragOver && !state.error,
            "border-blue-400 bg-blue-50": isDragOver,
            "border-red-400 bg-red-50": state.error,
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
          accept={acceptString}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          {state.error ? (
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
            {state.error ? (
              <div className="text-red-600">
                <p className="font-medium">Upload Error</p>
                <p className="text-sm">{state.error}</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragOver ? "Drop your image here" : "Upload payment proof"}
                </p>
                <p className="text-sm text-gray-500">
                  Drag and drop an image, or{" "}
                  <span className="text-blue-600 underline">browse files</span>
                </p>
              </div>
            )}
          </div>

          {!state.error && (
            <div className="text-xs text-gray-400 space-y-1">
              <p>
                Supports:{" "}
                {validationOptions.acceptedFormats
                  .map((f) => f.replace("image/", "").toUpperCase())
                  .join(", ")}
              </p>
              <p>Max file size: {validationOptions.maxSizeMB}MB</p>
            </div>
          )}
        </div>

        {isDragOver && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="text-blue-700 font-medium">Drop to upload</div>
          </div>
        )}
      </div>

      {state.error && (
        <button
          onClick={actions.clearError}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
