"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ImageGallery({
  name,
  images,
}: {
  name: string;
  images: string[];
}) {
  const primary = images[0];
  const rightTop = images[1];
  const rightBottom = images[2];

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const prev = useCallback(() => {
    setIndex((i) =>
      images.length ? (i - 1 + images.length) % images.length : 0
    );
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((i) => (images.length ? (i + 1) % images.length : 0));
  }, [images.length]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prev, next]);

  const currentSrc = images?.[index] ?? "";

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <button
            type="button"
            onClick={() => openAt(0)}
            className="relative w-full aspect-[16/9] overflow-hidden rounded-lg cursor-pointer focus:outline-none"
            aria-label={`Open photo 1 of ${images.length} for ${name}`}
          >
            {primary ? (
              <Image
                src={primary}
                alt={`${name} - photo 1`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                No image
              </div>
            )}

            <div className="absolute left-3 bottom-3">
              <Badge variant="secondary">{images.length} Photos</Badge>
            </div>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => openAt(1)}
            className="relative w-full aspect-[9/5] overflow-hidden rounded-lg cursor-pointer focus:outline-none"
            aria-label={`Open photo 2 of ${images.length} for ${name}`}
          >
            {rightTop ? (
              <Image
                src={rightTop}
                alt={`${name} - photo 2`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                No image
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => openAt(2)}
            className="relative w-full aspect-[9/5] overflow-hidden rounded-lg cursor-pointer focus:outline-none"
            aria-label={`Open photo 3 of ${images.length} for ${name}`}
          >
            {rightBottom ? (
              <>
                <Image
                  src={rightBottom}
                  alt={`${name} - photo 3`}
                  fill
                  className="object-cover"
                />
                {images.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      +{images.length - 3} more photos
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                No image
              </div>
            )}
          </button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-transparent w-screen h-screen max-w-none max-h-none rounded-none border-0 shadow-none">
          <DialogTitle className="sr-only">{name} photos</DialogTitle>
          <div className="relative w-full h-full">
            {/* Prev button */}
            {images.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-black/20 p-2 text-white hover:bg-black/30"
                onClick={prev}
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Next button */}
            {images.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-black/20 p-2 text-white hover:bg-black/30"
                onClick={next}
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            <div className="absolute inset-0 flex items-center justify-center px-2">
              {currentSrc ? (
                <div className="max-w-[98vw] max-h-[98vh] w-full h-full">
                  <Image
                    src={currentSrc}
                    alt={`${name} - photo ${index + 1}`}
                    fill
                    sizes="98vw"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  No image
                </div>
              )}
            </div>

            {/* counter */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-50 text-white bg-black/20 px-3 py-1 rounded">
              {index + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
