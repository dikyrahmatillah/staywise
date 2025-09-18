"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, FileImage, RotateCcw, ZoomIn, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImagePreviewProps {
  file?: File
  imageUrl?: string // For existing uploaded images
  onRemove?: () => void
  onReplace?: () => void
  className?: string
  showActions?: boolean
  title?: string
}

export function ImagePreview({
  file,
  imageUrl,
  onRemove,
  onReplace,
  className,
  showActions = true,
  title,
}: ImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setImageError(false)

      // Cleanup URL when component unmounts or file changes
      return () => URL.revokeObjectURL(url)
    } else if (imageUrl) {
      setPreviewUrl(imageUrl)
      setImageError(false)
    } else {
      setPreviewUrl(null)
    }
  }, [file, imageUrl])

  const displayUrl = previewUrl || imageUrl
  const fileName = file?.name || "Payment Proof"
  const fileSize = file ? (file.size / 1024).toFixed(1) + " KB" : null

  const handleImageError = () => {
    setImageError(true)
  }

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleDownload = () => {
    if (displayUrl) {
      const link = document.createElement("a")
      link.href = displayUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (!displayUrl) {
    return null
  }

  return (
    <>
      <div className={cn("relative bg-white rounded-lg border shadow-sm", className)}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FileImage className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{title || fileName}</p>
              {fileSize && <p className="text-xs text-gray-500">{fileSize}</p>}
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleFullscreenToggle} className="h-8 w-8 p-0">
                <ZoomIn className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={handleDownload} className="h-8 w-8 p-0">
                <Download className="h-4 w-4" />
              </Button>

              {onReplace && (
                <Button variant="ghost" size="sm" onClick={onReplace} className="h-8 w-8 p-0">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}

              {onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
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
        {file && (
          <div className="px-4 py-2 bg-gray-50 rounded-b-lg text-xs text-gray-600">
            <div className="flex justify-between items-center">
              <span>Type: {file.type.split("/")[1].toUpperCase()}</span>
              <span>Modified: {new Date(file.lastModified).toLocaleDateString()}</span>
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
  )
}
