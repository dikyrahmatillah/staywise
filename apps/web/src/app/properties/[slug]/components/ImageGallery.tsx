"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const nextImage = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 h-[450px]">
        <div className="md:col-span-8 h-full">
          <button
            type="button"
            onClick={() => openAt(0)}
            className="relative w-full h-full overflow-hidden rounded-l-xl cursor-pointer focus:outline-none group"
            aria-label={`Open photo 1 of ${images.length} for ${name}`}
          >
            {primary ? (
              <>
                <Image
                  src={primary}
                  alt={`${name} - photo 1`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </>
            ) : (
              <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                No image
              </div>
            )}

            <div className="absolute left-5 bottom-5 z-10">
              <Badge className="px-3 py-1.5 text-sm bg-white/90 text-black hover:bg-white/95 transition-colors">
                {images.length} Photos
              </Badge>
            </div>
          </button>
        </div>

        <div className="md:col-span-4 flex flex-col gap-2 h-full">
          <button
            type="button"
            onClick={() => openAt(1)}
            className="relative w-full h-1/2 overflow-hidden rounded-tr-xl cursor-pointer focus:outline-none group"
            aria-label={`Open photo 2 of ${images.length} for ${name}`}
          >
            {rightTop ? (
              <>
                <Image
                  src={rightTop}
                  alt={`${name} - photo 2`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </>
            ) : (
              <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                No image
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => openAt(2)}
            className="relative w-full h-1/2 overflow-hidden rounded-br-xl cursor-pointer focus:outline-none group"
            aria-label={`Open photo 3 of ${images.length} for ${name}`}
          >
            {rightBottom ? (
              <>
                <Image
                  src={rightBottom}
                  alt={`${name} - photo 3`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {images.length > 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                    <span className="text-white text-lg font-semibold">
                      +{images.length - 3} more photos
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
        <DialogContent className="max-w-6xl w-full p-0 bg-transparent border-none">
          <div className="relative bg-black h-[80vh] flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 z-10"
              onClick={() => setOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="w-full h-full relative flex items-center justify-center">
              <DialogTitle>
                <span className="sr-only">{name} photos</span>
              </DialogTitle>
              {images[index] && (
                <Image
                  src={images[index]}
                  alt={`${name} - photo ${index + 1}`}
                  fill
                  className="object-contain"
                />
              )}
            </div>

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 hover:bg-white/50 z-10"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 hover:bg-white/50 z-10"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
              <span>
                {index + 1} of {images.length}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
