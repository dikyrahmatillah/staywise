"use client";

import { useState } from "react";
import Image from "next/image";
import { X, FileImage, RotateCcw, ZoomIn, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePaymentProof } from "./payment-proof-context";
import { formatFileSize, getFileExtension } from "./utils";

export function PreviewArea() {
  const { state, actions } = usePaymentProof();
  const [imageError, setImageError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!state.selectedFile && !state.existingProofUrl) {
    return null;
  }

  const displayUrl = state.selectedFile?.preview || state.existingProofUrl || "";
  const fileName = state.selectedFile?.file.name || "Payment Proof";
  const fileSize = state.selectedFile?.file.size 
    ? formatFileSize(state.selectedFile.file.size) 
    : null;
  const fileExtension = state.selectedFile?.file.name 
    ? getFileExtension(state.selectedFile.file.name)
    : null;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    if (!displayUrl) return;

    const link = document.createElement("a");
    link.href = displayUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="relative bg-white rounded-lg border shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FileImage className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{fileName}</p>
              {fileSize && <p className="text-xs text-gray-500">{fileSize}</p>}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFullscreenToggle}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>

            {state.selectedFile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={actions.onFileReplace}
                className="h-8 w-8 p-0"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={actions.onFileRemove}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image Preview */}
        <div className="relative aspect-video bg-gray-50">
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FileImage className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Unable to preview image</p>
              </div>
            </div>
          ) : (
            <Image
              src={displayUrl}
              alt={fileName}
              fill
              className="object-contain rounded-b-lg"
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>

        {/* File Info Footer */}
        {state.selectedFile && (
          <div className="px-4 py-2 bg-gray-50 rounded-b-lg text-xs text-gray-600">
            <div className="flex justify-between items-center">
              {fileExtension && <span>Type: {fileExtension}</span>}
              <span>
                Modified: {state.selectedFile.uploadedAt.toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-screen-lg max-h-screen-lg w-full h-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFullscreenToggle}
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="relative w-full h-full">
              {!imageError && displayUrl && (
                <Image
                  src={displayUrl}
                  alt={fileName}
                  fill
                  className="object-contain"
                  onError={handleImageError}
                  sizes="100vw"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}